import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import api from "../services/api";

const sortOptions = [
  { label: "Mới nhất", value: "newest" },
  { label: "Giá thấp nhất", value: "lowest-price" },
  { label: "Giá cao nhất", value: "highest-price" },
  { label: "Bán chạy", value: "best-selling" },
  { label: "Nổi bật", value: "featured" }
];

function SearchResultPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = (searchParams.get("keyword") || "").trim();
  const category = searchParams.get("category") || "";
  const brand = searchParams.get("brand") || "";
  const priceMin = searchParams.get("priceMin") || "";
  const priceMax = searchParams.get("priceMax") || "";
  const stockStatus = searchParams.get("stockStatus") || "";
  const sort = searchParams.get("sort") || "newest";
  const page = Number(searchParams.get("page")) > 0 ? Number(searchParams.get("page")) : 1;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState(null);
  const [availableFilters, setAvailableFilters] = useState({ categories: [], brands: [] });

  const buildSearchParams = (limit = 12, requestedPage = page) => {
    const params = {
      keyword,
      page: requestedPage,
      limit
    };

    if (category) params.category = category;
    if (brand) params.brand = brand;
    if (priceMin) params.priceMin = priceMin;
    if (priceMax) params.priceMax = priceMax;
    if (stockStatus) params.stockStatus = stockStatus;
    if (sort) params.sort = sort;

    return params;
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/products", { params: buildSearchParams(12, page) });
        const payload = response.data?.data || {};
        const results = Array.isArray(payload.products) ? payload.products : [];

        setProducts(results);
        setPagination({
          totalProducts: payload.totalProducts || 0,
          totalPages: payload.totalPages || 1,
          currentPage: payload.currentPage || page,
          limit: 12
        });
      } catch (err) {
        console.error(err);
        setProducts([]);
        setPagination(null);
        setError("Đã xảy ra lỗi khi tìm kiếm sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    const fetchFilterOptions = async () => {
      try {
        const response = await api.get("/products", { params: buildSearchParams(1000, 1) });
        const payload = response.data?.data || {};
        const results = Array.isArray(payload.products) ? payload.products : [];

        setAvailableFilters({
          categories: [...new Set(results.map((result) => result.category).filter(Boolean))].sort(),
          brands: [...new Set(results.map((result) => result.brand).filter(Boolean))].sort()
        });
      } catch (err) {
        console.error(err);
        setAvailableFilters({ categories: [], brands: [] });
      }
    };

    fetchSearchResults();
    fetchFilterOptions();
  }, [keyword, category, brand, priceMin, priceMax, stockStatus, sort, page]);

  const updateParam = (key, value) => {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }

    nextParams.delete("page");
    setSearchParams(nextParams);
  };

  const handlePageChange = (nextPage) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("page", String(nextPage));
    setSearchParams(nextParams);
  };

  const clearFilters = () => {
    const nextParams = new URLSearchParams(searchParams.toString());
    ["category", "brand", "priceMin", "priceMax", "stockStatus", "sort", "page"].forEach((key) => {
      nextParams.delete(key);
    });
    setSearchParams(nextParams);
  };

  const hasActiveFilters = Boolean(category || brand || priceMin || priceMax || stockStatus || sort !== "newest");

  const pageNumbers = useMemo(() => {
    if (!pagination || pagination.totalPages <= 1) {
      return [];
    }

    const maxVisible = 5;
    const start = Math.max(1, Math.min(pagination.currentPage - 2, pagination.totalPages - maxVisible + 1));
    return Array.from({ length: Math.min(maxVisible, pagination.totalPages) }, (_, index) => start + index);
  }, [pagination]);

  return (
    <section className="page-shell">
      <div className="section-heading">
        <div>
          <p className="section-label">Kết quả tìm kiếm</p>
          <h2>
            {keyword
              ? `Tìm thấy ${pagination?.totalProducts || 0} sản phẩm cho từ khóa "${keyword}"`
              : "Tìm kiếm sản phẩm"}
          </h2>
          <p className="search-summary">
            {keyword
              ? "Kết quả được lọc theo từ khóa, danh mục, thương hiệu, mức giá và tình trạng kho."
              : "Nhập từ khóa để tìm laptop, PC hoặc linh kiện phù hợp với nhu cầu của bạn."}
          </p>
        </div>
      </div>

      <div className="search-toolbar">
        <div className="search-filter-group">
          <label htmlFor="search-category">Danh mục</label>
          <select id="search-category" value={category} onChange={(event) => updateParam("category", event.target.value)}>
            <option value="">Tất cả</option>
            {availableFilters.categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="search-filter-group">
          <label htmlFor="search-brand">Thương hiệu</label>
          <select id="search-brand" value={brand} onChange={(event) => updateParam("brand", event.target.value)}>
            <option value="">Tất cả</option>
            {availableFilters.brands.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="search-filter-group">
          <label htmlFor="search-price-min">Giá tối thiểu</label>
          <input
            id="search-price-min"
            type="number"
            min="0"
            value={priceMin}
            onChange={(event) => updateParam("priceMin", event.target.value)}
            placeholder="0"
          />
        </div>

        <div className="search-filter-group">
          <label htmlFor="search-price-max">Giá tối đa</label>
          <input
            id="search-price-max"
            type="number"
            min="0"
            value={priceMax}
            onChange={(event) => updateParam("priceMax", event.target.value)}
            placeholder="100000000"
          />
        </div>

        <div className="search-filter-group">
          <label htmlFor="search-stock">Kho</label>
          <select id="search-stock" value={stockStatus} onChange={(event) => updateParam("stockStatus", event.target.value)}>
            <option value="">Tất cả</option>
            <option value="in-stock">Còn hàng</option>
            <option value="low-stock">Sắp hết</option>
            <option value="out-of-stock">Hết hàng</option>
          </select>
        </div>

        <div className="search-filter-group">
          <label htmlFor="search-sort">Sắp xếp</label>
          <select id="search-sort" value={sort} onChange={(event) => updateParam("sort", event.target.value)}>
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters ? (
          <div className="search-filter-group">
            <label htmlFor="search-clear">Bộ lọc</label>
            <button id="search-clear" type="button" className="search-page-btn" onClick={clearFilters}>
              Xóa bộ lọc
            </button>
          </div>
        ) : null}
      </div>

      {loading ? <div className="search-state-card">Đang tìm kiếm sản phẩm...</div> : null}
      {error ? <p className="form-error">{error}</p> : null}

      {!loading && !error ? (
        <>
          {products.length > 0 ? (
            <>
              <div className="product-grid">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {pagination && pagination.totalPages > 1 ? (
                <div className="search-pagination">
                  <button
                    type="button"
                    className="search-page-btn"
                    onClick={() => handlePageChange(Math.max(1, pagination.currentPage - 1))}
                    disabled={pagination.currentPage <= 1}
                  >
                    Trước
                  </button>
                  {pageNumbers.map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      className={`search-page-btn ${pageNumber === pagination.currentPage ? "is-active" : ""}`}
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="search-page-btn"
                    onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.currentPage + 1))}
                    disabled={pagination.currentPage >= pagination.totalPages}
                  >
                    Sau
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <div className="empty-state-card">
              <h3>Không tìm thấy sản phẩm phù hợp.</h3>
              <p>Vui lòng thử lại với từ khóa khác hoặc điều chỉnh bộ lọc.</p>
            </div>
          )}
        </>
      ) : null}
    </section>
  );
}

export default SearchResultPage;