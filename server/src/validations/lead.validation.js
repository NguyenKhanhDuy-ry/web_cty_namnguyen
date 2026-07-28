const isEmail = (value) => /^\S+@\S+\.\S+$/.test(value);

const validateLeadPayload = (payload) => {
  const errors = [];
  const fullName = String(payload.fullName || "").trim();
  const phoneNumber = String(payload.phoneNumber || "").trim();
  const email = String(payload.email || "").trim();
  const serviceInterest = String(payload.serviceInterest || "").trim();
  const message = String(payload.message || "").trim();

  if (!fullName) errors.push("Họ và tên là bắt buộc");
  if (!phoneNumber) errors.push("Số điện thoại là bắt buộc");
  if (!email || !isEmail(email)) errors.push("Email không hợp lệ");
  if (!serviceInterest) errors.push("Vui lòng chọn dịch vụ quan tâm");
  if (!message) errors.push("Nội dung liên hệ là bắt buộc");

  return {
    valid: errors.length === 0,
    errors,
    value: {
      fullName,
      phoneNumber,
      email,
      companyName: String(payload.companyName || "").trim(),
      serviceInterest,
      message
    }
  };
};

module.exports = {
  validateLeadPayload
};
