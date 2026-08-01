import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";
import { formatCurrency } from "../utils/formatCurrency";

function SearchBox() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchTimeoutRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const nextKeyword = searchParams.get("keyword") || "";
    setKeyword(nextKeyword);
  }, [searchParams]);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    const trimmedKeyword = keyword.trim();
    if (!isFocused || trimmedKeyword.length < 2) {
      setIsSearching(false);
      setSuggestions([]);
      return undefined;
    }

    setIsSearching(true);
    const controller = new AbortController();
    searchTimeoutRef.current = window.setTimeout(async () => {
      try {
        const response = await api.get("/products", {
          params: { keyword: trimmedKeyword, limit: 5, page: 1 },
          signal: controller.signal
        });
        const products = Array.isArray(response.data?.data?.products) ? response.data.data.products : [];
        setSuggestions(products);
      } catch (error) {
        if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
          return;
        }
        console.error("Lỗi khi lấy gợi ý tìm kiếm:", error);
        setSuggestions([]);
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, 300);

    return () => {
      controller.abort();
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [keyword, isFocused]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsFocused(false);
        setSuggestions([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedKeyword = keyword.trim();
    setIsFocused(false);
    setSuggestions([]);

    if (trimmedKeyword) {
      navigate(`/tim-kiem?keyword=${encodeURIComponent(trimmedKeyword)}`);
      return;
    }

    navigate("/tim-kiem");
  };

  const handleSuggestionClick = () => {
    setIsFocused(false);
    setSuggestions([]);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setIsFocused(false);
      setSuggestions([]);
    }
  };

  const shouldShowSuggestions = isFocused && keyword.trim().length > 0 && (isSearching || suggestions.length > 0 || keyword.trim().length >= 2);

  return (
    <form className="header-search" onSubmit={handleSubmit} ref={wrapperRef}>
      <input
        type="text"
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        onFocus={() => setIsFocused(true)}
        onKeyDown={handleKeyDown}
        placeholder="Tìm kiếm laptop, PC..."
        aria-label="Tìm kiếm sản phẩm"
      />
      <button type="submit" aria-label="Tìm kiếm">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>

      {shouldShowSuggestions ? (
        <div className="search-suggestions" role="listbox">
          {isSearching ? <div className="suggestion-item is-loading">Đang tìm...</div> : null}
          {!isSearching && suggestions.length === 0 && keyword.trim().length >= 2 ? (
            <div className="suggestion-item is-empty">Không tìm thấy sản phẩm</div>
          ) : null}
          {suggestions.map((product) => (
            <Link
              key={product._id}
              to={`/san-pham/${product._id}`}
              className="suggestion-item"
              onClick={handleSuggestionClick}
            >
              <img src={product.thumbnail || product.image} alt={product.name} />
              <div className="suggestion-body">
                <strong>{product.name}</strong>
                <span>{formatCurrency(product.price)}</span>
                <small>
                  {product.category}
                  {product.brand ? ` • ${product.brand}` : ""}
                </small>
              </div>
            </Link>
          ))}
        </div>
      ) : null}
    </form>
  );
}

export default SearchBox;