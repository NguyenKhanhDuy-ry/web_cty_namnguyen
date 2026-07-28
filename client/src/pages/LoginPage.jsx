import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [socialMessage, setSocialMessage] = useState("");

  const defaultRedirect = user?.role === "admin" ? "/quan-tri" : "/tai-khoan";
  const redirectTo = location.state?.from?.pathname || defaultRedirect;

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const nextUser = await login(form);
      navigate(
        location.state?.from?.pathname ||
          (nextUser.role === "admin" ? "/quan-tri" : "/tai-khoan"),
        { replace: true }
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSocialLogin = (provider) => {
    setSocialMessage(
      `Đăng nhập bằng ${provider} đã có giao diện frontend, nhưng chưa cấu hình OAuth app id/secret ở backend.`
    );
  };

  return (
    <section className="auth-portal">
      <div className="auth-portal-card">
        <div className="auth-portal-logo">N</div>
        <h1>Log in to see more</h1>

        <form className="auth-portal-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={form.email}
            onChange={(event) =>
              setForm((current) => ({ ...current, email: event.target.value }))
            }
            placeholder="Email or phone number"
            autoComplete="username"
          />
          <input
            type="password"
            value={form.password}
            onChange={(event) =>
              setForm((current) => ({ ...current, password: event.target.value }))
            }
            placeholder="Password"
            autoComplete="current-password"
          />
          {error ? <p className="form-error auth-portal-error">{error}</p> : null}
          <button className="auth-portal-submit" type="submit" disabled={submitting}>
            {submitting ? "Dang xu ly..." : "Log in"}
          </button>
        </form>

        <p className="auth-portal-divider">OR</p>

        <div className="auth-portal-socials">
          <button className="auth-social-btn auth-social-facebook" type="button" onClick={() => handleSocialLogin("Facebook")}>
            <span>f</span>
            Continue with Facebook
          </button>
          <button className="auth-social-btn auth-social-google" type="button" onClick={() => handleSocialLogin("Google")}>
            <span>G</span>
            Continue with Google
          </button>
        </div>

        {socialMessage ? <p className="sync-note auth-portal-note">{socialMessage}</p> : null}

        <div className="auth-portal-links">
          <Link to="/quen-mat-khau">Forgot your password?</Link>
          <p>
            Not on Nam Nguyen yet? <Link to="/dang-ky">Sign Up</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
