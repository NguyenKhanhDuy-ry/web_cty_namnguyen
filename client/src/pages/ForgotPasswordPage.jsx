import { useState } from "react";
import { Link } from "react-router-dom";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage(
      email
        ? `Đã ghi nhận yêu cầu khôi phục cho ${email}. Đây là giao diện demo frontend, backend reset password chưa được bật.`
        : "Vui lòng nhập email trước khi gửi yêu cầu."
    );
  };

  return (
    <section className="auth-portal">
      <div className="auth-portal-card">
        <div className="auth-portal-logo">P</div>
        <h1>Reset your password</h1>

        <form className="auth-portal-form" onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email or phone number"
          />
          {message ? <p className="sync-note auth-portal-note">{message}</p> : null}
          <button className="auth-portal-submit" type="submit">
            Send request
          </button>
        </form>

        <div className="auth-portal-links">
          <Link to="/dang-nhap">Back to login</Link>
          <p>
            Need an account? <Link to="/dang-ky">Sign Up</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default ForgotPasswordPage;
