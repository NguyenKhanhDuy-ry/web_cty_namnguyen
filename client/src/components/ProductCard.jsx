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
    alert(`Đã thêm "${product.name}" vào giỏ hàng.`);
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
        <Link to={productPath} aria-label={`Xem chi tiết ${product.name}`}>
          <span className="product-badge">{product.badge || "HOT"}</span>
          <span className="product-discount">{getDiscountText(product)}</span>
          <img src={product.thumbnail || product.image} alt={product.name} />
        </Link>

        <div className="product-hover-actions">
          <Link className="product-hover-button" to={productPath} aria-label={`Xem chi tiet ${product.name}`}>
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M1.5 12s3.75-6.75 10.5-6.75S22.5 12 22.5 12s-3.75 6.75-10.5 6.75S1.5 12 1.5 12Z" />
              <path d="M12 15.75A3.75 3.75 0 1 0 12 8.25a3.75 3.75 0 0 0 0 7.5Z" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="product-card-body">
        <p className="product-brand">
          {product.category}
          {product.brand && ` • ${product.brand}`}
        </p>
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

        <div className="product-stock-indicator">
          <span
            className={`stock-dot ${product.stock > 5 ? "in-stock" : product.stock > 0 ? "low-stock" : "out-of-stock"}`}
          />
          <span>
            {product.stock > 5 ? "Còn hàng" : product.stock > 0 ? "Sắp hết hàng" : "Hết hàng"}
          </span>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
