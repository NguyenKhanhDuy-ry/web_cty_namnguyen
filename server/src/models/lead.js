const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    companyName: { type: String, default: "", trim: true },
    serviceInterest: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, default: "new", trim: true }
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Lead", leadSchema);
