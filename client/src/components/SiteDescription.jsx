import React from "react";

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    title: "Sản phẩm chính hãng",
    text: "Cam kết 100% hàng mới, đầy đủ giấy tờ."
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V6.375c0-.621.504-1.125 1.125-1.125h.375m18 3.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75m0 0h.375c.621 0 1.125.504 1.125 1.125v.75c0 .621-.504 1.125-1.125 1.125h-.375m0 0h-1.5" />
      </svg>
    ),
    title: "Giá cả cạnh tranh",
    text: "Luôn có ưu đãi, trả góp 0% hấp dẫn."
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M9 12.75 11.25 15 15 9.75" />
        <path d="M21.75 12c0 5.385-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12 6.615 2.25 12 2.25 21.75 6.615 21.75 12Z" />
        <path d="M15.75 6h.008v.008h-.008V6Z" />
      </svg>
    ),
    title: "Bảo hành chính hãng",
    text: "Hỗ trợ bảo hành tại hãng hoặc tại cửa hàng."
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.139A48.782 48.782 0 0 0 12 5.25c-2.295 0-4.515.325-6.675.97-1.028.296-1.725 1.258-1.725 2.35v.958m15.352-2.484A12.03 12.03 0 0 1 12 5.25c-2.953 0-5.758.99-8.025 2.67m16.05 0a12.03 12.03 0 0 0-8.025-2.67" />
      </svg>
    ),
    title: "Giao hàng toàn quốc",
    text: "Giao nhanh 2h tại TP.HCM, miễn phí vận chuyển."
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
    title: "Thanh toán an toàn",
    text: "Hỗ trợ COD, chuyển khoản, trả góp qua thẻ."
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.006 3 11.5c0 2.502 1.423 4.73 3.655 6.224v2.403l3.34-1.994a10.024 10.024 0 0 0 2.005.217Z" />
      </svg>
    ),
    title: "Hỗ trợ 24/7",
    text: "Đội ngũ kỹ thuật viên chuyên nghiệp, tận tâm."
  }
];

function SiteDescription() {
  return (
    <section className="site-description-section">
      <div className="site-description-content">
        <h2 className="site-description-title">
          NAM NGUYEN TECHNOLOGY – CỬA HÀNG LAPTOP & PC UY TÍN
        </h2>
        <div className="site-description-body">
          <div className="site-description-text">
            <p>
              <strong>Nam Nguyễn Technology</strong> là đơn vị chuyên cung cấp các sản phẩm laptop, PC và linh kiện máy tính chính hãng hàng đầu tại Việt Nam. Với sứ mệnh mang đến những sản phẩm công nghệ chất lượng cao và dịch vụ khách hàng vượt trội, chúng tôi đã và đang trở thành điểm đến tin cậy cho game thủ, chuyên gia đồ họa và người dùng văn phòng.
            </p>
            <h3>Laptop Gaming, Văn Phòng và MacBook Chính Hãng</h3>
            <p>
              Chúng tôi tự hào cung cấp đa dạng các dòng <strong>laptop gaming</strong> từ những thương hiệu nổi tiếng như ASUS ROG, MSI, Acer Predator, Dell Alienware với cấu hình mạnh mẽ, đáp ứng mọi tựa game đỉnh cao. Bên cạnh đó, các dòng <strong>laptop văn phòng</strong> mỏng nhẹ, hiệu năng ổn định và <strong>MacBook</strong> sang trọng, mạnh mẽ cũng luôn sẵn hàng để phục vụ nhu cầu làm việc và sáng tạo của bạn.
            </p>
            <h3>PC Gaming, Phụ Kiện và Dịch Vụ Hỗ Trợ</h3>
            <p>
              Ngoài laptop, Nam Nguyễn Technology còn mang đến các bộ <strong>PC Gaming</strong> được xây dựng sẵn hoặc tùy chỉnh theo yêu cầu, cùng hàng ngàn <strong>phụ kiện máy tính</strong> như chuột, bàn phím, tai nghe, màn hình. Tất cả sản phẩm đều là hàng chính hãng, được hưởng chính sách bảo hành uy tín và mức giá cạnh tranh nhất thị trường.
            </p>
            <p>
              Chúng tôi cam kết giao hàng nhanh chóng trên toàn quốc, hỗ trợ kỹ thuật chuyên nghiệp và mang lại trải nghiệm mua sắm online thuận tiện, an toàn. Hãy đến với Nam Nguyễn Technology để tìm thấy người bạn đồng hành công nghệ lý tưởng nhất!
            </p>
          </div>
          <div className="site-description-features">
            {features.map((feature) => (
              <article key={feature.title} className="site-description-feature-item">
                <div className="feature-text">
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SiteDescription;
