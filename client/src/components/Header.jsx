import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import SearchBox from "./SearchBox";

const navItems = [
  { label: "Trang chủ", href: "/" },
  {
    label: "Laptop",
    href: "/#categories",
    submenu: [
      { label: "Laptop Gaming", href: "/danh-muc/laptop-gaming" },
      { label: "Laptop Văn phòng", href: "/danh-muc/laptop-van-phong" },
      { label: "MacBook", href: "/danh-muc/macbook" }
    ]
  },
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
  const location = useLocation();

  const handleScrollToTop = () => {
    if (location.pathname === "/") {
      window.scrollTo(0, 0);
    }
  };

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
        <Link className="brand brand-ecom" to="/" onClick={handleScrollToTop}>
          <span className="brand-mark">NN</span>
          <span className="brand-copy">
            <strong>NAM NGUYEN</strong>
            <span>TECHNOLOGY</span>
          </span>
        </Link>
        <nav className="nav nav-ecom" aria-label="Dieu huong chinh">
          {navItems.map((item, index) => (
            <div key={item.label} className={`nav-item ${index === 0 ? "is-active" : ""}`}>
              {item.submenu ? (
                <span className="nav-link-with-submenu">
                  {item.label}
                  <svg className="nav-chevron" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>
                </span>
              ) : item.href.startsWith("/") ? (
                <Link to={item.href} onClick={item.href === "/" ? handleScrollToTop : undefined}>{item.label}</Link>
              ) : (
                <a href={item.href}>{item.label}</a>
              )}
              {item.submenu && (
                <ul className="nav-submenu">
                  {item.submenu.map((subItem) => (
                    <li key={subItem.label}>
                      <Link to={subItem.href}>{subItem.label}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>
        <SearchBox />
        <div className="header-actions header-actions-ecom">
          <Link className="header-icon-link" aria-label="Tai khoan" to={accountPath}>
            <HeaderIcon>
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                <path d="M5 20a7 7 0 0 1 14 0" />
              </svg>
            </HeaderIcon>
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
