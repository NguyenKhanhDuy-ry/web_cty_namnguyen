import { useState } from "react";
import { Link } from "react-router-dom";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage(
      email
        ? `Đã ghi nhận yêu cầu khôi phục cho ${email}. Đây là giao diện demo, chức năng reset mật khẩu ở backend chưa được bật.`
        : "Vui lòng nhập email trước khi gửi yêu cầu."
    );
  };

  return (
    <section className="auth-portal">
      <div className="auth-portal-card">
        <div className="auth-portal-logo">P</div>
        <h1>Đặt lại mật khẩu</h1>

        <form className="auth-portal-form" onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email hoặc số điện thoại"
          />
          {message ? <p className="sync-note auth-portal-note">{message}</p> : null}
          <button className="auth-portal-submit" type="submit">
            Gửi yêu cầu
          </button>
        </form>

        <div className="auth-portal-links">
          <Link to="/dang-nhap">Quay lại đăng nhập</Link>
          <p>
            Cần một tài khoản? <Link to="/dang-ky">Đăng ký</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default ForgotPasswordPage;
