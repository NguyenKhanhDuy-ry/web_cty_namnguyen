const siteService = require("../services/site.service");

const getSiteContent = async (req, res, next) => {
  try {
    const data = await siteService.getSiteContent();

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSiteContent
};
