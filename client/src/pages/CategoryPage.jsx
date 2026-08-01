import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import api from "../services/api";

function CategoryPage() {
  const { categorySlug } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        setError("");

        // Convert slug back to a readable category name for the API query
        const categoryName = categorySlug.replace(/-/g, " ");

        const response = await api.get("/products", { params: { category: categoryName, limit: 50 } });
        const payload = response.data?.data || {};
        const results = Array.isArray(payload.products) ? payload.products : [];

        setProducts(results);
        if (results.length > 0) {
          setCategory(results[0].category);
        } else {
          setCategory(categorySlug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()));
        }
      } catch (err) {
        setError("Không thể tải sản phẩm cho danh mục này.");
      } finally {
        setLoading(false);
      }
    };

    if (categorySlug) {
      fetchCategoryProducts();
    }
  }, [categorySlug]);

  return (
    <section className="page-shell">
      <div className="section-heading">
        <div>
          <p className="section-label">Danh mục</p>
          <h2 style={{ textTransform: "capitalize" }}>{category || "Sản phẩm"}</h2>
        </div>
      </div>

      {loading && <div className="search-state-card">Đang tải sản phẩm...</div>}
      {error && <p className="form-error">{error}</p>}

      {!loading && !error && (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

export default CategoryPage;