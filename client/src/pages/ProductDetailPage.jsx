import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import api from "../services/api";
import { formatCurrency } from "../utils/formatCurrency";
import { getDiscountText, getProductGallery } from "../utils/productHelpers";

function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("specs");
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        setError("");

        const productResponse = await api.get(`/products/${productId}`);
        const currentProduct = productResponse.data?.data;

        setProduct(currentProduct);
        const gallery = getProductGallery(currentProduct);
        setActiveImage(gallery[0] || currentProduct.image);

        if (currentProduct?.category) {
          const relatedResponse = await api.get("/products", {
            params: {
              category: currentProduct.category,
              limit: 4
            }
          });

          const nextRelatedProducts = (relatedResponse.data?.data || []).filter(
            (item) => item._id !== currentProduct._id
          );

          setRelatedProducts(nextRelatedProducts.slice(0, 3));
        } else {
          setRelatedProducts([]);
        }
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Không tải được sản phẩm");
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const gallery = useMemo(() => getProductGallery(product), [product]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity);
    navigate("/thanh-toan");
  };

  if (isLoading) {
    return (
      <section className="page-shell">
        <p>Đang tải sản phẩm...</p>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="page-shell">
        <div className="empty-state-card">
          <h1>Không tìm thấy sản phẩm</h1>
          <p>{error || "Sản phẩm đã bị xóa hoặc không tồn tại."}</p>
          <Link className="ecom-btn ecom-btn-primary" to="/">
            Quay về trang chủ
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="product-detail-page">
      <section className="page-shell product-detail-shell">
        <div className="product-breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span>/</span>
          <span>Sản phẩm</span>
          <span>/</span>
          <strong>{product.name}</strong>
        </div>

        <Link className="back-link" to="/">
          Quay lai
        </Link>

        <div className="product-detail-hero">
          <div className="product-gallery-panel">
            <div className="product-main-image">
              <img src={activeImage || product.image} alt={product.name} />
            </div>

            <div className="product-thumbnail-row">
              {gallery.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  className={`product-thumbnail ${activeImage === image ? "is-active" : ""}`}
                  type="button"
                  onClick={() => setActiveImage(image)}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="product-summary-panel">
            <div className="product-summary-topline">
              <span>{product.brand}</span>
              <span className="product-inline-badge">{product.badge || "HOT"}</span>
            </div>

            <h1>{product.name}</h1>

            <div className="product-review-row">
              <span className="product-review-stars">★★★★☆</span>
              <strong>{product.rating || 4.9}</strong>
              <span>({product.reviewCount || 248} đánh giá)</span>
            </div>

            <div className="product-price-banner">
              <strong>{formatCurrency(product.price)}</strong>
              <span>{product.oldPrice ? formatCurrency(product.oldPrice) : ""}</span>
              <em>{getDiscountText(product)}</em>
            </div>

            <div className="product-key-specs">
              <article>
                <span>CPU</span>
                <strong>{product.specs?.cpu}</strong>
              </article>
              <article>
                <span>RAM</span>
                <strong>{product.specs?.ram}</strong>
              </article>
              <article>
                <span>SSD</span>
                <strong>{product.specs?.ssd}</strong>
              </article>
              <article>
                <span>VGA</span>
                <strong>{product.specs?.gpu}</strong>
              </article>
            </div>

            <div className="product-purchase-row">
              <div className="quantity-selector">
                <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))}>
                  -
                </button>
                <span>{quantity}</span>
                <button type="button" onClick={() => setQuantity((current) => current + 1)}>
                  +
                </button>
              </div>

              <button className="ecom-btn ecom-btn-ghost product-add-cart-btn" type="button" onClick={handleAddToCart}>
                Thêm giỏ
              </button>
            </div>

            <button className="ecom-btn ecom-btn-primary product-buy-now-btn" type="button" onClick={handleBuyNow}>
              Mua ngay - {formatCurrency(product.price * quantity)}
            </button>

            <div className="product-policy-row">
              <article>BH chinh hang</article>
              <article>Giao trong 2h</article>
              <article>Doi tra 30 ngay</article>
            </div>
          </div>
        </div>

        <div className="product-detail-tabs">
          <div className="product-tab-buttons">
            <button
              className={activeTab === "specs" ? "is-active" : ""}
              type="button"
              onClick={() => setActiveTab("specs")}
            >
              Thong so ky thuat
            </button>
            <button
              className={activeTab === "description" ? "is-active" : ""}
              type="button"
              onClick={() => setActiveTab("description")}
            >
              Mô tả sản phẩm
            </button>
            <button
              className={activeTab === "reviews" ? "is-active" : ""}
              type="button"
              onClick={() => setActiveTab("reviews")}
            >
              Đánh giá
            </button>
          </div>

          {activeTab === "specs" ? (
            <div className="product-spec-table">
              <div><span>Bo vi xu ly</span><strong>{product.specs?.cpu}</strong></div>
              <div><span>RAM</span><strong>{product.specs?.ram}</strong></div>
              <div><span>O cung</span><strong>{product.specs?.ssd}</strong></div>
              <div><span>Card do hoa</span><strong>{product.specs?.gpu}</strong></div>
              <div><span>Man hinh</span><strong>{product.specs?.display}</strong></div>
              <div><span>Thương hiệu</span><strong>{product.brand}</strong></div>
              <div><span>Danh muc</span><strong>{product.category}</strong></div>
              <div><span>Ton kho</span><strong>{product.stock}</strong></div>
            </div>
          ) : null}

          {activeTab === "description" ? (
            <div className="product-description-panel">
              <p>
                {product.description ||
                  product.shortDescription ||
                  "Sản phẩm chính hãng, bảo hành rõ ràng và tối ưu cho nhu cầu sử dụng thực tế."}
              </p>
            </div>
          ) : null}

          {activeTab === "reviews" ? (
            <div className="product-description-panel">
              <p>
                Đánh giá trung bình {product.rating || 4.9}/5 từ {product.reviewCount || 248} khách hàng.
                Phan nay hien dang duoc dong bo them voi he thong review.
              </p>
            </div>
          ) : null}
        </div>
      </section>

      {relatedProducts.length ? (
        <section className="ecom-section related-products-section">
          <div className="section-heading">
            <div>
              <p className="section-label">Goi y</p>
              <h2>Sản phẩm liên quan</h2>
            </div>
          </div>

          <div className="product-grid product-grid-related">
            {relatedProducts.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default ProductDetailPage;
