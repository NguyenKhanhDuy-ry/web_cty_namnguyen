const Lead = require("../models/lead");

const createLead = async (leadData) => {
  return Lead.create(leadData);
};

const getLeads = async () => {
  return Lead.find().sort({ createdAt: -1 }).lean();
};

module.exports = {
  createLead,
  getLeads
};
