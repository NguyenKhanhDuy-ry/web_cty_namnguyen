const Company = require("../models/company");
const Service = require("../models/service");
const Project = require("../models/project");
const Testimonial = require("../models/testimonial");
const Contact = require("../models/contact");
const Stat = require("../models/stat");

const getSiteContent = async () => {
  const [company, services, projects, testimonials, contacts, stats] =
    await Promise.all([
      Company.findOne().lean(),
      Service.find().sort({ highlight: -1, createdAt: 1 }).lean(),
      Project.find().sort({ createdAt: -1 }).lean(),
      Testimonial.find().sort({ createdAt: -1 }).lean(),
      Contact.find().sort({ createdAt: 1 }).lean(),
      Stat.find().sort({ createdAt: 1 }).lean()
    ]);

  return {
    company,
    services,
    projects,
    testimonials,
    contacts,
    stats
  };
};

module.exports = {
  getSiteContent
};
