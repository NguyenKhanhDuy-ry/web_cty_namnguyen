import { useEffect, useState } from "react";
import SiteDescription from "../components/SiteDescription";
import ProductCard from "../components/ProductCard";
import api from "../services/api";

const fallbackCompany = {
  name: "Nam Nguyen Technology",
  brand: "NAM NGUYEN",
  slogan: "Laptop chính hãng, hiệu năng cao và giao nhanh toàn quốc",
  headline: "Hiệu năng mạnh mẽ",
  description:
    "Chính hãng 100%, trả góp 0%, bảo hành 24 tháng. Tư vấn đúng nhu cầu và giao nhanh trên toàn quốc.",
  phone: "18006868",
  email: "sales@namnguyen.vn",
  address: "123 Nguyen Hue, Quan 1, TP.HCM"
};

const trustBadges = ["Chính hãng 100%", "Trả góp 0%", "Bảo hành 24 tháng", "4.9 sao đánh giá"];

const serviceHighlights = [
  {
    title: "Giao hàng toàn quốc",
    text: "Giao trong 2h tại TP.HCM và Hà Nội. Toàn quốc trong 24-48h."
  },
  {
    title: "Bảo hành chính hãng",
    text: "Bảo hành 12-36 tháng tại trung tâm chính hãng, hỗ trợ tận nhà."
  },
  {
    title: "Đổi trả nhanh 30 ngày",
    text: "Đổi trả trong 30 ngày nếu lỗi nhà sản xuất, không phát sinh phí."
  },
  {
    title: "Thanh toán an toàn",
    text: "Hỗ trợ trả góp 0% lãi suất, thanh toán online mã hóa SSL."
  }
];

const categoryCards = [
  { title: "Gaming", subtitle: "RTX 4070-4090", count: "48 sản phẩm" },
  { title: "Laptop Văn phòng", subtitle: "Mỏng nhẹ, bền bỉ", count: "36 sản phẩm" },
  { title: "Đồ họa", subtitle: "Màn OLED 4K", count: "22 sản phẩm" },
  { title: "MacBook", subtitle: "Chip M4 Series", count: "15 sản phẩm" },
  { title: "Laptop AI", subtitle: "NPU tích hợp", count: "18 sản phẩm" },
  { title: "Phụ kiện", subtitle: "Chuột, tai nghe", count: "124 sản phẩm" }
];

const fallbackFeaturedProducts = [
  {
    brand: "ASUS",
    name: "ASUS ROG Strix G16 2024",
    specs: {
      cpu: "i9-14900HX",
      ram: "32GB DDR5",
      ssd: "1TB NVMe",
      gpu: "RTX 4080 12GB",
      display: '16" QHD+ 240Hz'
    },
    price: 52990000,
    oldPrice: 62990000,
    badge: "HOT",
    discount: "-16%",
    reviewCount: 248,
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80"
  },
  {
    brand: "MSI",
    name: "MSI Raider GE78 HX",
    specs: {
      cpu: "i9-14900HX",
      ram: "64GB DDR5",
      ssd: "2TB NVMe",
      gpu: "RTX 4090 16GB",
      display: '17.3" QHD 240Hz'
    },
    price: 79990000,
    oldPrice: 88990000,
    badge: "NEW",
    discount: "-11%",
    reviewCount: 167,
    image:
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=1200&q=80"
  },
  {
    brand: "APPLE",
    name: 'Apple MacBook Pro 16" M4 Max',
    specs: {
      cpu: "M4 Max 16-core",
      ram: "48GB Unified Memory",
      ssd: "1TB SSD",
      gpu: "40-core GPU",
      display: '16" Liquid Retina XDR'
    },
    price: 89990000,
    oldPrice: 95990000,
    badge: "PREMIUM",
    discount: "-6%",
    reviewCount: 412,
    image:
      "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1200&q=80"
  },
  {
    brand: "DELL",
    name: "Dell XPS 15 9530",
    specs: {
      cpu: "i7-13700H",
      ram: "32GB LPDDR5",
      ssd: "512GB NVMe",
      gpu: "RTX 4060 8GB",
      display: '15.6" OLED 3.5K'
    },
    price: 42990000,
    oldPrice: 51990000,
    badge: "SALE",
    discount: "-17%",
    reviewCount: 189,
    image:
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=1200&q=80"
  }
];

const brandLogos = ["MSI", "ACER", "DELL", "HP", "LENOVO", "APPLE", "GIGABYTE", "RAZER", "SAMSUNG", "ASUS"];

const newsItems = [
  {
    tag: "TIN TỨC",
    title: "RTX 5090 Laptop: Kỳ nguyên mới của laptop gaming cao cấp",
    excerpt: "NVIDIA chính thức ra mắt dòng GPU RTX 5090 dành riêng cho laptop, mang đến hiệu năng chưa từng có...",
    meta: "08/07/2026  -  5 phút đọc",
    image:
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1200&q=80"
  },
  {
    tag: "REVIEW",
    title: "Top 10 Laptop Gaming Tốt Nhất 2026: Lựa chọn cho mọi ngân sách",
    excerpt: "Thị trường laptop gaming 2026 ngày càng đa dạng với nhiều lựa chọn hấp dẫn từ phân khúc trung...",
    meta: "05/07/2026  -  8 phút đọc",
    image:
      "https://images.unsplash.com/photo-1603481546579-65d935ba9cdd?auto=format&fit=crop&w=1200&q=80"
  },
  {
    tag: "APPLE",
    title: "Apple M4 Ultra: Chip xử lý mạnh nhất thế giới cho MacBook Pro",
    excerpt: "Apple vừa ra mắt chip M4 Ultra với hiệu năng vượt trội, đánh dấu bước nhảy vọt lớn trong lịch sử Mac...",
    meta: "02/07/2026  -  6 phút đọc",
    image:
      "https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?auto=format&fit=crop&w=1200&q=80"
  }
];

const footerBenefits = ["Giao hàng nhanh", "Bao hành 24 thang", "Đổi trả 30 ngay", "Trả góp 0%"];

function HomePage() {
  const [company, setCompany] = useState(fallbackCompany);
  const [featuredProducts, setFeaturedProducts] = useState(fallbackFeaturedProducts);
  const [newsletterStatus, setNewsletterStatus] = useState("");

  useEffect(() => {
    const loadContent = async () => {
      try {
        const [siteResponse, productResponse] = await Promise.all([
          api.get("/site"),
          api.get("/products", {
            params: { limit: 8, sort: "newest" }
          })
        ]);

        const remoteCompany = siteResponse.data?.data?.company;
        const productPayload = productResponse.data?.data || {};
        const remoteProducts = Array.isArray(productPayload.products) ? productPayload.products : [];

        if (remoteCompany) {
          setCompany({
            ...fallbackCompany,
            ...remoteCompany,
            brand: "NAM NGUYEN"
          });
        }

        if (remoteProducts.length) {
          setFeaturedProducts(remoteProducts);
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadContent();
  }, []);

  const handleNewsletterSubmit = (event) => {
    event.preventDefault();
    setNewsletterStatus("Đã ghi nhận email. Chúng tôi sẽ gửi ưu đãi sớm nhất.");
  };

  return (
    <div className="ecom-page">
      <section className="hero-ecom">
        <div className="hero-grid-overlay" />

        <div className="hero-content">
          <div className="hero-copy-panel">
            <p className="section-label">Laptop chính hãng</p>
            <h1>
              Hiệu năng
              <span>mạnh mẽ</span>
            </h1>
            <p className="hero-description-ecom">{company.description}</p>

            <div className="hero-badge-row">
              {trustBadges.map((item) => (
                <span key={item} className="hero-chip">
                  {item}
                </span>
              ))}
            </div>

            <div className="hero-actions-ecom">
              <a className="ecom-btn ecom-btn-primary" href="#featured-products">
                Mua ngay
              </a>
              <a className="ecom-btn ecom-btn-secondary" href="#categories">
                Xem sản phẩm
              </a>
            </div>

            <div className="hero-stats">
              <article>
                <strong>5,000+</strong>
                <span>Sản phẩm</span>
              </article>
              <article>
                <strong>50,000+</strong>
                <span>Khách hàng</span>
              </article>
              <article>
                <strong>3 nam</strong>
                <span>Kinh nghiệm</span>
              </article>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-preview-card">
              <div className="hero-preview-header">
                <span>NAM NGUYỄN</span>
                <span>Ưu đãi tháng 7</span>
              </div>
              <div className="hero-preview-body">
                <div className="hero-preview-copy">
                  <p>Laptop cao cấp</p>
                  <h2>Hiệu năng vượt trội</h2>
                  <strong>MacBook Air M4</strong>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=1200&q=80"
                  alt="Laptop premium"
                />
              </div>
              <div className="hero-floating-chip hero-floating-chip-left">
                <span>Chip</span>
                <strong>Intel Core i9</strong>
                <small>14th Gen HX</small>
              </div>
              <div className="hero-floating-chip hero-floating-chip-right">
                <span>RTX GPU</span>
                <strong>RTX 4090</strong>
                <small>16GB GDDR7</small>
              </div>
              <div className="hero-sale-bubble">
                <span>Ưu đãi</span>
                <strong>15%</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-bottom-strip">
          {["Sản phẩm chính hãng", "Hỗ trợ kỹ thuật 24/7", "7 ngày đổi trả", "Bảo hành chính hãng"].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      <section className="service-highlight-grid">
        {serviceHighlights.map((item) => (
          <article key={item.title} className="service-highlight-card">
            <div className="service-highlight-icon" />
            <div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="ecom-section" id="categories">
        <div className="section-heading">
          <div>
            <p className="section-label">Danh mục</p>
            <h2>Khám phá theo nhu cầu</h2>
          </div>
          <a className="section-link" href="#featured-products">
            Xem tất cả
          </a>
        </div>

        <div className="category-grid">
          {categoryCards.map((item) => (
            <a key={item.title} href={`/danh-muc/${item.title.toLowerCase().replace(/ /g, "-")}`} className="category-card">
              <article>
                <div className="category-icon-box" />
                <div className="category-card-glow" />
                <h3>{item.title}</h3>
                <p>{item.subtitle}</p>
                <span>{item.count}</span>
              </article>
            </a>
          ))}
        </div>
      </section>

      <section className="ecom-section" id="featured-products">
        <div className="section-heading">
          <div>
            <p className="section-label">Nổi bật</p>
            <h2>Sản phẩm nổi bật</h2>
          </div>
          <div className="filter-tabs">
            {["Tất cả", "Gaming", "MacBook", "Văn phòng"].map((item, index) => (
              <button key={item} className={`filter-tab ${index === 0 ? "is-active" : ""}`} type="button">
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="product-grid">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id || product.slug || product.name} product={product} />
          ))}
        </div>

        <div className="center-cta">
          <a className="outline-cta" href="/tim-kiem">
            Xem tất cả sản phẩm
          </a>
        </div>
      </section>

      <section className="flash-sale-band">
        <div className="flash-sale-copy">
          <p className="section-label section-label-light">Ưu đãi đặc biệt</p>
          <h2>FLASH SALE</h2>
          <p>Giảm đến 40% tất cả laptop gaming</p>
        </div>

        <div className="flash-sale-timer">
          <span>
            <strong>06</strong>
            Giờ
          </span>
          <i>:</i>
          <span>
            <strong>23</strong>
            Phút
          </span>
          <i>:</i>
          <span>
            <strong>47</strong>
            Giây
          </span>
        </div>

        <a className="flash-sale-btn" href="#featured-products">
          Xem ưu đãi ngay
        </a>
      </section>

      <section className="ecom-section brand-section">
        <p className="section-label section-label-center">Thương hiệu đối tác</p>
        <div className="brand-grid">
          {brandLogos.map((brand) => (
            <article key={brand} className="brand-card">
              {brand}
            </article>
          ))}
        </div>
      </section>

      <section className="ecom-section">
        <div className="section-heading">
          <div>
            <p className="section-label">Tin tức</p>
            <h2>Tin tức công nghệ</h2>
          </div>
          <a className="section-link" href="#newsletter">
            Xem tất cả
          </a>
        </div>

        <div className="news-grid">
          {newsItems.map((item) => (
            <article key={item.title} className="news-card">
              <div className="news-image-wrap">
                <span className="news-tag">{item.tag}</span>
                <img src={item.image} alt={item.title} />
              </div>
              <div className="news-card-body">
                <p className="news-meta">{item.meta}</p>
                <h3>{item.title}</h3>
                <p>{item.excerpt}</p>
                <a href="#newsletter">Đọc thêm</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="testimonial-section">
        <p className="section-label section-label-center">Đánh giá</p>
        <h2>Khách hàng nói gì về chúng tôi</h2>

        <div className="testimonial-stats">
          <article>
            <strong>50,000+</strong>
            <span>Khách hàng</span>
          </article>
          <article>
            <strong>4.9/5</strong>
            <span>Đánh giá TB</span>
          </article>
          <article>
            <strong>98%</strong>
            <span>Đánh giá</span>
          </article>
        </div>

        <article className="testimonial-feature-card">
          <p>
            "Mua ASUS ROG tại đây, giao hàng siêu nhanh, máy dùng hàng chính hãng, hiệu năng cực đỉnh.
            Rất hài lòng với dịch vụ tư vấn nhiệt tình."
          </p>
          <div className="testimonial-footer">
            <div>
              <strong>Nguyen Minh Tuan</strong>
              <span>Game thủ chuyên nghiệp</span>
            </div>
            <em>ASUS ROG Strix G16</em>
          </div>
        </article>
      </section>

      <section className="newsletter-section" id="newsletter">
        <div className="hero-grid-overlay" />
        <div className="newsletter-inner">
          <p className="section-label section-label-center">Nhận ưu đãi độc quyền</p>
          <h2>Nhận ưu đãi độc quyền</h2>
          <p>Đăng ký nhận bản tin để nhận mã giảm giá 10% cho đơn hàng đầu tiên.</p>

          <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
            <input placeholder="Nhập email của bạn..." type="email" />
            <button className="ecom-btn ecom-btn-primary" type="submit">
              Đăng ký
            </button>
          </form>
          {newsletterStatus ? <p className="newsletter-status">{newsletterStatus}</p> : null}
        </div>
      </section>

      <section className="footer-benefits">
        {footerBenefits.map((item) => (
          <article key={item} className="footer-benefit-item">
            <div className="service-highlight-icon" />
            <div>
              <h3>{item}</h3>
              <p>{item === "Giao hàng nhanh" ? "2h tại TP.HCM & Hà Nội" : "Dịch vụ và chính sách minh bạch"}</p>
            </div>
          </article>
        ))}
      </section>
      <SiteDescription />
    </div>
  );
}

export default HomePage;
