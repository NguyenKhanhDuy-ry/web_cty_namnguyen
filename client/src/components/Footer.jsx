function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner site-footer-ecom" id="footer-contact">
        <section className="footer-brand-block">
          <div className="brand brand-ecom footer-brand">
            <span className="brand-mark">NN</span>
            <span className="brand-copy">
              <strong>NAM NGUYEN</strong>
              <span>TECHNOLOGY</span>
            </span>
          </div>
          <p>
            Chuyên cung cấp laptop chính hãng, gaming cao cấp với giá tốt nhất thị trường.
            Bảo hành uy tín, giao hàng nhanh toàn quốc.
          </p>
          <ul>
            <li>Số nhà 36, Ngõ 321 Dương Tự Minh, Tổ 26, Phường Quan Triều, Tỉnh Thái Nguyên, Việt Nam</li>
            <li>1800 6868</li>
            <li>sales@namnguyen.vn</li>
            <li>7:30 - 22:00 hàng ngày</li>
          </ul>
        </section>

        <section className="footer-links-block">
          <h3>Danh mục sản phẩm</h3>
          <a href="/#featured-products">Laptop Gaming</a>
          <a href="/#categories">Laptop Văn phòng</a>
          <a href="/#featured-products">Laptop Đồ họa</a>
          <a href="/#featured-products">MacBook</a>
          <a href="/#newsletter">Phụ kiện</a>
          <a href="/#newsletter">Flash Sale</a>
        </section>

        <section className="footer-links-block">
          <h3>Chính sách & hỗ trợ</h3>
          <a href="/#newsletter">Chính sách bảo hành</a>
          <a href="/#newsletter">Chính sách đổi trả</a>
          <a href="/#newsletter">Chính sách vận chuyển</a>
          <a href="/#newsletter">Chính sách trả góp</a>
          <a href="/#newsletter">Điều khoản sử dụng</a>
          <a href="/#newsletter">Câu hỏi thường gặp</a>
        </section>

        <section className="footer-map-block">
          <h3>Tìm showroom</h3>
          <div className="footer-map-card">
            <strong>Số nhà 36, Ngõ 321 Dương Tự Minh, Tổ 26, Phường Quan Triều</strong>
            <span>Tỉnh Thái Nguyên, Việt Nam</span>
            <a href="https://maps.app.goo.gl/agbAb5HDQboLmXj67" target="_blank" rel="noreferrer">
              Xem bản đồ
            </a>
          </div>
          <div className="footer-hotline-card">
            <p>HOTLINE MIỄN PHÍ 24/7</p>
            <strong>1800 6868</strong>
            <span>Chat với tư vấn viên ngay</span>
          </div>
        </section>
      </div>

      <div className="site-footer-bottom">
        <p>© 2026 Nam Nguyen Technology. Tất cả quyền được bao lưu.</p>
        <span>DKKD: 0102030405</span>
      </div>
    </footer>
  );
}

export default Footer;
