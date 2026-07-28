import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/formatCurrency";
import { getDiscountText } from "../utils/productHelpers";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const productPath = product?._id ? `/san-pham/${product._id}` : "#";

  const handleAddToCart = () => {
    if (!product?._id) return;
    addToCart(product, 1);
  };

  const handleBuyNow = () => {
    if (!product?._id) return;
    addToCart(product, 1);
    navigate("/thanh-toan");
  };

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <span className="product-badge">{product.badge || "HOT"}</span>
        <span className="product-discount">{getDiscountText(product)}</span>
        <img src={product.image} alt={product.name} />

        <div className="product-hover-actions">
          <Link className="product-hover-button" to={productPath} aria-label={`Xem chi tiết ${product.name}`}>
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M1.5 12s3.75-6.75 10.5-6.75S22.5 12 22.5 12s-3.75 6.75-10.5 6.75S1.5 12 1.5 12Z" />
              <path d="M12 15.75A3.75 3.75 0 1 0 12 8.25a3.75 3.75 0 0 0 0 7.5Z" />
            </svg>
          </Link>
          <button className="product-hover-button" type="button" aria-label="Yeu thich">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="m12 20-1.4-1.28C5.4 14 2 10.9 2 7.09 2 4 4.42 1.6 7.5 1.6c1.74 0 3.41.81 4.5 2.09A6.09 6.09 0 0 1 16.5 1.6C19.58 1.6 22 4 22 7.09c0 3.81-3.4 6.91-8.6 11.63L12 20Z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="product-card-body">
        <p className="product-brand">{product.brand}</p>
        <h3>
          <Link to={productPath}>{product.name}</Link>
        </h3>

        <div className="product-spec-grid">
          <span>CPU {product.specs?.cpu || product.cpu}</span>
          <span>RAM {product.specs?.ram || product.ram}</span>
          <span>SSD {product.specs?.ssd || product.ssd}</span>
          <span>VGA {product.specs?.gpu || product.gpu}</span>
        </div>

        <p className="product-display">{product.specs?.display || product.display}</p>

        <div className="product-rating">
          ★★★★★ <span>({product.reviewCount || 248})</span>
        </div>

        <div className="product-price-row">
          <strong>{typeof product.price === "number" ? formatCurrency(product.price) : product.price}</strong>
          <span>{typeof product.oldPrice === "number" ? formatCurrency(product.oldPrice) : product.oldPrice}</span>
        </div>

        <div className="product-actions">
          <button className="ecom-btn ecom-btn-ghost" type="button" onClick={handleAddToCart}>
            Thêm giỏ
          </button>
          <button className="ecom-btn ecom-btn-primary" type="button" onClick={handleBuyNow}>
            Mua ngay
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
