const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
    note: { type: String, required: true, trim: true }
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Contact", contactSchema);
