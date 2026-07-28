const leadService = require("../services/lead.service");
const { validateLeadPayload } = require("../validations/lead.validation");

const createLead = async (req, res, next) => {
  try {
    const { valid, errors, value } = validateLeadPayload(req.body);

    if (!valid) {
      return res.status(400).json({
        success: false,
        message: errors[0],
        errors
      });
    }

    const lead = await leadService.createLead(value);

    return res.status(201).json({
      success: true,
      message: "Đã gửi yêu cầu liên hệ",
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

const getLeads = async (req, res, next) => {
  try {
    const leads = await leadService.getLeads();

    return res.status(200).json({
      success: true,
      data: leads
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLead,
  getLeads
};
