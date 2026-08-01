import { Link } from "react-router-dom";

const footerLinks = [
  {
    title: "VỀ NAM NGUYÊN",
    links: [
      { label: "Giới thiệu", href: "/gioi-thieu" },
      { label: "Tuyển dụng", href: "#" },
      { label: "Liên hệ", href: "#" }
    ]
  },
  {
    title: "CHÍNH SÁCH",
    links: [
      { label: "Chính sách bảo hành", href: "#" },
      { label: "Chính sách giao hàng", href: "#" },
      { label: "Chính sách đổi trả", href: "#" },
      { label: "Chính sách bảo mật", href: "#" }
    ]
  },
  {
    title: "THÔNG TIN",
    links: [
      { label: "Hệ thống cửa hàng", href: "#" },
      { label: "Hướng dẫn mua hàng", href: "#" },
      { label: "Hướng dẫn thanh toán", href: "#" },
      { label: "Hướng dẫn trả góp", href: "#" },
      { label: "Tra cứu bảo hành", href: "#" },
      { label: "Build PC", href: "#" }
    ]
  }
];

const SocialIcon = ({ href, children }) => (
  <a href={href} target="_blank" rel="noreferrer" className="footer-social-icon">
    {children}
  </a>
);

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-ecom">
        <div className="footer-brand-block">
          <div className="brand brand-ecom footer-brand">
            <span className="brand-mark">NN</span>
            <span className="brand-copy">
              <strong>NAM NGUYEN</strong>
              <span>TECHNOLOGY</span>
            </span>
          </div>
          <p>Đơn vị chuyên cung cấp laptop gaming, workstation và thiết bị công nghệ cao cấp với cam kết chất lượng và bảo hành uy tín.</p>
          <ul>
            <li>Hotline: 1800 6868</li>
            <li>Email: support@namnguyen.vn</li>
            <li>Địa chỉ: 123 Nguyễn Huệ, Quận 1, TP.HCM</li>
          </ul>
        </div>

        {footerLinks.map((column) => (
          <div key={column.title} className="footer-links-block">
            <h3>{column.title}</h3>
            <ul>
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

      </div>

      <div className="site-footer-bottom">
        <p>© 2026 Nam Nguyên Technology. All rights reserved.</p>
        <div className="footer-socials">
          <SocialIcon href="https://facebook.com">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
            </svg>
          </SocialIcon>
          <SocialIcon href="https://youtube.com">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.582 7.306s-.192-1.354-.782-1.944c-.732-.732-1.54-.782-1.944-.832C16.343 4.5 12 4.5 12 4.5s-4.343 0-6.856.03c-.404.05-1.212.1-1.944.832-.59.59-.782 1.944-.782 1.944S2.226 8.95 2.226 10.594v2.812c0 1.644.192 3.288.192 3.288s.192 1.354.782 1.944c.732.732 1.64.732 2.044.832C7.657 19.5 12 19.5 12 19.5s4.343 0 6.856-.03c.404-.05 1.212-.1 1.944-.832.59-.59.782-1.944.782-1.944S21.774 15.05 21.774 13.406v-2.812c0-1.644-.192-3.288-.192-3.288zM9.823 15.094V8.094l5.177 3.5-5.177 3.5z" />
            </svg>
          </SocialIcon>
          <SocialIcon href="https://tiktok.com">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.05-4.84-.95-6.43-2.8-1.59-1.87-2.15-4.24-1.72-6.59.45-2.43 1.95-4.47 3.99-5.77.63-.4 1.31-.73 2.01-.99.02-3.53.01-7.07.01-10.61.02-1.51.53-2.99 1.52-4.18 1.03-1.24 2.58-1.96 4.16-1.98z" />
            </svg>
          </SocialIcon>
          <SocialIcon href="https://zalo.me">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.53 13.63c-.3.18-.78.3-1.28.3-.63 0-1.05-.2-1.43-.58-.38-.38-.58-.88-.58-1.48V11.4h3.2v-1.8h-3.2V8.4c0-.58.2-.88.58-.88.25 0 .5.08.73.23l.38-.63c-.3-.18-.7-.28-1.18-.28-.63 0-1.13.2-1.5.58-.38.38-.58.88-.58 1.48v1.12H9.6v1.8h1.12v2.45c0 1.2.45 2.18 1.35 2.93.9.75 2.05 1.13 3.45 1.13.5 0 1.08-.08 1.73-.23l-.38-.63z" />
            </svg>
          </SocialIcon>
        </div>
      </div>
    </footer>
  );
}


export default Footer;
