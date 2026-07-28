import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const navItems = [
  { label: "Trang chủ", href: "/" },
  { label: "Laptop", href: "/#categories" },
  { label: "Gaming", href: "/#featured-products" },
  { label: "Văn phòng", href: "/#categories" },
  { label: "MacBook", href: "/#featured-products" },
  { label: "Khuyến mãi", href: "/#newsletter" },
  { label: "Tin tức", href: "/#newsletter" },
  { label: "Liên hệ", href: "/#footer-contact" }
];

const topBenefits = [
  "Chính hãng 100%",
  "Trả góp 0%",
  "Bảo hành 24 tháng",
  "Miễn phí vận chuyển"
];

function HeaderIcon({ children }) {
  return (
    <span className="header-icon-svg" aria-hidden="true">
      {children}
    </span>
  );
}

function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useCart();
  const dashboardPath = user?.role === "admin" ? "/quan-tri" : "/tai-khoan";
  const accountPath = isAuthenticated ? dashboardPath : "/dang-nhap";

  return (
    <header className="site-header">
      <div className="site-header-topbar">
        <div className="site-header-topbar-inner">
          <div className="site-header-topbar-list">
            {topBenefits.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <a className="site-header-hotline" href="tel:18006868">
            Hotline: 1800 6868
          </a>
        </div>
      </div>
      <div className="site-header-inner">
        <Link className="brand brand-ecom" to="/">
          <span className="brand-mark">NN</span>
          <span className="brand-copy">
            <strong>NAM NGUYEN</strong>
            <span>TECHNOLOGY</span>
          </span>
        </Link>
        <nav className="nav nav-ecom" aria-label="Dieu huong chinh">
          {navItems.map((item, index) => (
            <a key={item.label} className={index === 0 ? "is-active" : ""} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="header-search">
          <input type="text" placeholder="Tìm laptop, linh kiện..." aria-label="Tìm kiếm sản phẩm" />
        </div>
        <div className="header-actions header-actions-ecom">
          <Link className="header-icon-link" aria-label="Tài khoản" to={accountPath}>
            <HeaderIcon>
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                <path d="M5 20a7 7 0 0 1 14 0" />
              </svg>
            </HeaderIcon>
          </Link>
          <span className="header-icon-link header-icon-favorite">
            <HeaderIcon>
              <svg viewBox="0 0 24 24" fill="none">
                <path d="m12 20-1.4-1.28C5.4 14 2 10.9 2 7.09 2 4 4.42 1.6 7.5 1.6c1.74 0 3.41.81 4.5 2.09A6.09 6.09 0 0 1 16.5 1.6C19.58 1.6 22 4 22 7.09c0 3.81-3.4 6.91-8.6 11.63L12 20Z" />
              </svg>
            </HeaderIcon>
            <i>3</i>
          </span>
          <Link className="purchase-btn purchase-btn-small purchase-btn-cart" to="/gio-hang">
            Giỏ hàng
            {totalItems ? <b>{totalItems}</b> : null}
          </Link>
          {isAuthenticated ? (
            <>
              <Link className="header-user-link" to={dashboardPath}>
                {user?.role === "admin" ? "Admin Panel" : "Dashboard"}
              </Link>
              <button className="purchase-btn purchase-btn-small" type="button" onClick={logout}>
                Logout
              </button>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export default Header;
