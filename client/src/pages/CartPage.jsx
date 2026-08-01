import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/formatCurrency";
import { getShippingFee } from "../utils/productHelpers";

function CartPage() {
  const navigate = useNavigate();
  const { items, subtotal, updateQuantity, removeFromCart } = useCart();
  const shippingFee = getShippingFee(subtotal);
  const totalAmount = subtotal + shippingFee;

  if (!items.length) {
    return (
      <section className="page-shell">
        <div className="empty-state-card">
          <h1>Giỏ hàng đang trống</h1>
          <p>Hãy chọn sản phẩm bạn muốn mua, sau đó quay lại đây để thanh toán.</p>
          <Link className="ecom-btn ecom-btn-primary" to="/">
            Tiếp tục mua sắm
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page-shell cart-page-shell">
      <div className="cart-layout">
        <div className="cart-items-panel">
          <div className="cart-panel-header">
            <div>
              <p className="section-label">Giỏ hàng</p>
              <h1>Sản phẩm đã chọn</h1>
            </div>
            <Link className="section-link" to="/">
              Tiep tuc mua sam
            </Link>
          </div>

          <div className="cart-item-list">
            {items.map((item) => (
              <article key={item._id} className="cart-item-card">
                <Link className="cart-item-image" to={`/san-pham/${item._id}`}>
                  <img src={item.thumbnail || item.image} alt={item.name} />
                </Link>

                <div className="cart-item-body">
                  <p className="product-brand">{item.brand}</p>
                  <h3>
                    <Link to={`/san-pham/${item._id}`}>{item.name}</Link>
                  </h3>
                  <p className="cart-item-spec">
                    {[item.specs?.cpu, item.specs?.ram, item.specs?.gpu].filter(Boolean).join(" • ")}
                  </p>

                  <div className="cart-item-footer">
                    <div className="quantity-selector">
                      <button type="button" onClick={() => updateQuantity(item._id, item.quantity - 1)}>
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                        +
                      </button>
                    </div>

                    <strong>{formatCurrency(item.price * item.quantity)}</strong>
                  </div>
                </div>

                <button className="cart-remove-btn" type="button" onClick={() => removeFromCart(item._id)}>
                  Xoa
                </button>
              </article>
            ))}
          </div>
        </div>

        <aside className="cart-summary-panel">
          <h2>Tam tinh don hang</h2>

          <div className="summary-line">
            <span>Tam tinh</span>
            <strong>{formatCurrency(subtotal)}</strong>
          </div>
          <div className="summary-line">
            <span>Van chuyen</span>
            <strong>{shippingFee === 0 ? "Mien phi" : formatCurrency(shippingFee)}</strong>
          </div>
          <div className="summary-line summary-line-total">
            <span>Tong cong</span>
            <strong>{formatCurrency(totalAmount)}</strong>
          </div>

          <button
            className="ecom-btn ecom-btn-primary cart-checkout-btn"
            type="button"
            onClick={() => navigate("/thanh-toan")}
          >
            Tien hanh thanh toan
          </button>
        </aside>
      </div>
    </section>
  );
}

export default CartPage;
