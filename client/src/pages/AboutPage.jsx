function AboutPage() {
  return (
    <div className="page-shell">
      <section className="content-section">
        <p className="eyebrow">Gioi thieu</p>
        <h1>Vi sao NNC phu hop cho website doanh nghiep va landing page thuong mai</h1>
        <p className="lead">
          NNC tập trung vào website có mục tiêu kinh doanh rõ ràng: thể hiện năng lực công ty,
          dịch vụ, lợi ích khách hàng nhận được và độ uy tín cần có để chốt khách hàng tiềm năng.
        </p>
      </section>

      <section className="cards-grid about-grid">
        <article className="info-card">
          <h3>Nang luc</h3>
          <p>Thiet ke website gioi thieu, landing page ban hang va he thong quan tri noi dung.</p>
        </article>
        <article className="info-card">
          <h3>Dinh huong</h3>
          <p>Giao diện sạch, dễ hiểu, đúng tone thương hiệu và có khả năng mở rộng dữ liệu.</p>
        </article>
        <article className="info-card">
          <h3>Giá trị</h3>
          <p>Website hoạt động ổn định, dễ bàn giao, dễ cập nhật và phù hợp triển khai thực tế.</p>
        </article>
      </section>
    </div>
  );
}

export default AboutPage;
