import { useEffect, useState } from "react";
import api from "../services/api";

function ServicesPage() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get("/site");
        setServices(response.data.data.services || []);
      } catch (error) {
        console.error(error);
      }
    };

    load();
  }, []);

  return (
    <div className="page-shell">
      <section className="content-section">
        <p className="eyebrow">Dịch vụ</p>
        <h1>Giải pháp web và phần mềm theo nhu cầu thương mại của doanh nghiệp</h1>
      </section>

      <section className="cards-grid">
        {services.map((service) => (
          <article key={service.slug} className={`info-card ${service.highlight ? "featured" : ""}`}>
            <p className="card-price">{service.price}</p>
            <h3>{service.name}</h3>
            <p>{service.summary}</p>
            <ul>
              {service.benefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </div>
  );
}

export default ServicesPage;
