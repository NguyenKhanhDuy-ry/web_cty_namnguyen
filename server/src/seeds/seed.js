require("dotenv").config();

const fs = require("fs");
const path = require("path");
const connectDB = require("../config/db");
const Company = require("../models/company");
const Service = require("../models/service");
const Project = require("../models/project");
const Testimonial = require("../models/testimonial");
const Contact = require("../models/contact");
const Stat = require("../models/stat");
const Product = require("../models/product");
const sampleProducts = require("../data/sample-products");

const readJson = (fileName) =>
  JSON.parse(fs.readFileSync(path.join(__dirname, "../../../database", fileName), "utf8"));

const seedCollection = async (Model, data) => {
  await Model.deleteMany({});
  if (Array.isArray(data)) {
    return Model.insertMany(data);
  }
  return Model.create(data);
};

const seed = async () => {
  await connectDB();

  const company = readJson("company.json");
  const services = readJson("services.json");
  const projects = readJson("projects.json");
  const testimonials = readJson("testimonials.json");
  const contacts = readJson("contacts.json");
  const stats = readJson("stats.json");

  await Promise.all([
    seedCollection(Company, company),
    seedCollection(Service, services),
    seedCollection(Project, projects),
    seedCollection(Testimonial, testimonials),
    seedCollection(Contact, contacts),
    seedCollection(Stat, stats),
    seedCollection(Product, sampleProducts)
  ]);

  console.log("Seed dữ liệu thương mại hoàn tất");
  process.exit(0);
};

seed().catch((error) => {
  console.error("Seed thất bại:", error);
  process.exit(1);
});
