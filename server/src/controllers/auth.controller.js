const authService = require("../services/auth.service");

const register = async (req, res, next) => {
  try {
    const {
      fullName = "",
      email = "",
      password = "",
      confirmPassword = ""
    } = req.body;

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      return res.status(400).json({
        success: false,
        message: "Họ tên, email và mật khẩu là bắt buộc"
      });
    }

    if (password.trim().length < 6) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu phải có ít nhất 6 ký tự"
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Xác nhận mật khẩu không khớp"
      });
    }

    const result = await authService.register({
      fullName,
      email,
      password
    });

    return res.status(201).json({
      success: true,
      message: "Đăng ký thành công",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email = "", password = "" } = req.body;

    if (!email.trim() || !password.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email và mật khẩu là bắt buộc"
      });
    }

    const result = await authService.login({ email, password });

    return res.status(200).json({
      success: true,
      message: "Đăng nhập thành công",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfileById(req.user.id);

    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Đăng xuất thành công"
  });
};

module.exports = {
  register,
  login,
  getProfile,
  logout
};
