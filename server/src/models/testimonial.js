const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    quote: { type: String, required: true, trim: true }
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);
