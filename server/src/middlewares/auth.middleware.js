const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../services/auth.service");

const requireAuth = (req, res, next) => {
  const authorization = req.headers.authorization || "";
  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      success: false,
      message: "Ban can dang nhap de truy cap"
    });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role
    };

    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Phien dang nhap da het han hoac khong hop le"
    });
  }
};

const optionalAuth = (req, res, next) => {
  const authorization = req.headers.authorization || "";
  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next();
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role
    };
  } catch {
    req.user = null;
  }

  return next();
};

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Ban can dang nhap de truy cap"
    });
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Ban khong co quyen thuc hien thao tac nay"
    });
  }

  return next();
};

module.exports = {
  requireAuth,
  optionalAuth,
  requireRole
};
