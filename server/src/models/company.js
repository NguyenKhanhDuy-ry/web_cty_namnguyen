const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    slogan: { type: String, required: true, trim: true },
    headline: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    taxCode: { type: String, required: true, trim: true },
    workingHours: { type: String, required: true, trim: true }
  },
  { versionKey: false }
);

module.exports = mongoose.model("Company", companySchema, "company");
