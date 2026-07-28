const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    summary: { type: String, required: true, trim: true },
    benefits: { type: [String], default: [] },
    price: { type: String, required: true, trim: true },
    highlight: { type: Boolean, default: false }
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Service", serviceSchema);
