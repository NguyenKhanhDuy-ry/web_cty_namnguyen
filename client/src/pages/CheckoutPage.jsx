import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import api from "../services/api";
import { formatCurrency } from "../utils/formatCurrency";
import { getShippingFee } from "../utils/productHelpers";

function CheckoutPage() {
  const { user } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const shippingFee = useMemo(() => getShippingFee(subtotal), [subtotal]);
  const totalAmount = subtotal + shippingFee;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const [orderCode, setOrderCode] = useState("");
  const [orderSnapshot, setOrderSnapshot] = useState(null);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    note: "",
    paymentMethod: "cod"
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!items.length) {
      setCheckoutMessage("Giỏ hàng đang trống.");
      return;
    }

    try {
      setIsSubmitting(true);
      setCheckoutMessage("");

      const response = await api.post("/orders", {
        customer: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          note: formData.note
        },
        paymentMethod: formData.paymentMethod,
        items: items.map((item) => ({
          productId: item._id,
          quantity: item.quantity
        }))
      });

      setOrderSnapshot({
        items: items.map((item) => ({ ...item })),
        subtotal,
        shippingFee,
        totalAmount
      });
      setOrderCode(response.data?.data?._id || "");
      setCheckoutMessage("Đặt hàng thành công. Chúng tôi đã ghi nhận đơn hàng của bạn.");
      clearCart();
    } catch (error) {
      setCheckoutMessage(error.response?.data?.message || "Không thể tạo đơn hàng.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayItems = orderSnapshot?.items?.length ? orderSnapshot.items : items;
  const displaySubtotal = orderSnapshot ? orderSnapshot.subtotal : subtotal;
  const displayShippingFee = orderSnapshot ? orderSnapshot.shippingFee : shippingFee;
  const displayTotalAmount = orderSnapshot ? orderSnapshot.totalAmount : totalAmount;

  if (!items.length && !orderCode) {
    return (
      <section className="page-shell">
        <div className="empty-state-card">
          <h1>Chưa có sản phẩm để thanh toán</h1>
          <p>Bạn cần thêm sản phẩm vào giỏ trước khi thanh toán.</p>
          <Link className="ecom-btn ecom-btn-primary" to="/">
            Quay lại mua sắm
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page-shell checkout-page-shell">
      <div className="checkout-layout">
        <form className="checkout-form-panel" onSubmit={handleSubmit}>
          <div className="cart-panel-header">
            <div>
              <p className="section-label">Thanh toán</p>
              <h1>Thông tin nhận hàng</h1>
            </div>
          </div>

          <div className="checkout-grid">
            <input name="fullName" placeholder="Họ và tên" value={formData.fullName} onChange={handleChange} required />
            <input name="email" placeholder="Email" type="email" value={formData.email} onChange={handleChange} required />
            <input name="phone" placeholder="Số điện thoại" value={formData.phone} onChange={handleChange} required />
            <input name="address" placeholder="Địa chỉ giao hàng" value={formData.address} onChange={handleChange} required />
          </div>

          <textarea
            className="checkout-note"
            name="note"
            placeholder="Ghi chu don hang"
            value={formData.note}
            onChange={handleChange}
            rows="4"
          />

          <div className="payment-method-list">
            <label className={`payment-method-card ${formData.paymentMethod === "cod" ? "is-active" : ""}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={formData.paymentMethod === "cod"}
                onChange={handleChange}
              />
              <span>Thanh toán khi nhận hàng</span>
            </label>
            <label className={`payment-method-card ${formData.paymentMethod === "banking" ? "is-active" : ""}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="banking"
                checked={formData.paymentMethod === "banking"}
                onChange={handleChange}
              />
              <span>Chuyển khoản ngân hàng</span>
            </label>
          </div>

          <button className="ecom-btn ecom-btn-primary checkout-submit-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Đang xử lý..." : "Xác nhận đặt hàng"}
          </button>

          {checkoutMessage ? (
            <p className="checkout-message">
              {checkoutMessage} {orderCode ? `Mã đơn: ${orderCode}` : ""}
            </p>
          ) : null}
        </form>

        <aside className="cart-summary-panel">
            <h2>Đơn hàng của bạn</h2>

          <div className="checkout-order-list">
            {displayItems.map((item) => (
              <article key={item._id} className="checkout-order-item">
                <div>
                  <strong>{item.name}</strong>
                  <span>
                    {item.quantity} x {formatCurrency(item.price)}
                  </span>
                </div>
                <strong>{formatCurrency(item.quantity * item.price)}</strong>
              </article>
            ))}
          </div>

          <div className="summary-line">
            <span>Tạm tính</span>
            <strong>{formatCurrency(displaySubtotal)}</strong>
          </div>
          <div className="summary-line">
            <span>Vận chuyển</span>
            <strong>{displayShippingFee === 0 ? "Mien phi" : formatCurrency(displayShippingFee)}</strong>
          </div>
          <div className="summary-line summary-line-total">
            <span>Tổng thanh toán</span>
            <strong>{formatCurrency(displayTotalAmount)}</strong>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default CheckoutPage;
