import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function UserDashboardPage() {
  const { user, logout } = useAuth();

  if (user?.role === "admin") {
    return <Navigate to="/quan-tri" replace />;
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">Tài khoản của bạn</p>
        <h1>Xin chào {user?.fullName}</h1>
        <p className="sync-note">
          Đây là giao diện quản lý tài khoản của bạn. Vai trò hiện tại: {user?.role === "admin" ? "Quản trị viên" : "Người dùng"}.
        </p>

        <div className="account-summary-grid">
          <article className="account-summary-card">
            <strong>{user?.email}</strong>
            <span>Email đăng nhập</span>
          </article>
          <article className="account-summary-card">
            <strong>{user?.role === "admin" ? "Quản trị viên" : "Người dùng"}</strong>
            <span>Quyền truy cập</span>
          </article>
        </div>

        <button className="btn btn-secondary" type="button" onClick={logout}>
          Đăng xuất
        </button>
      </div>
    </section>
  );
}

export default UserDashboardPage;
