import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, roles = [] }) {
  const { isAuthenticated, isReady, user } = useAuth();
  const location = useLocation();

  if (!isReady) {
    return (
      <section className="auth-page">
        <div className="auth-card">
          <h1>Đang tải phiên đăng nhập</h1>
          <p>Hệ thống đang xác thực người dùng, vui lòng chờ.</p>
        </div>
      </section>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/dang-nhap" replace state={{ from: location }} />;
  }

  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
