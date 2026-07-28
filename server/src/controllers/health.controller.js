const getHealth = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Frontend đã kết nối backend thành công."
  });
};

module.exports = {
  getHealth
};
