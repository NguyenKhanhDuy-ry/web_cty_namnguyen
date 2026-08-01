const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@nnc.local";
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@123";
const DEFAULT_ADMIN_NAME = process.env.ADMIN_NAME || "NNC Admin";
const JWT_SECRET = process.env.JWT_SECRET || "nnc-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

const sanitizeUser = (user) => ({
  id: user._id.toString(),
  fullName: user.fullName,
  email: user.email,
  role: user.role
});

const createToken = (user) =>
  jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

const ensureDefaultAdmin = async () => {
  const email = DEFAULT_ADMIN_EMAIL.trim().toLowerCase();
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return existingUser;
  }

  const passwordHash = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10);

  return User.create({
    fullName: DEFAULT_ADMIN_NAME,
    email,
    passwordHash,
    role: "admin",
    isActive: true
  });
};

const register = async ({ fullName, email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    const error = new Error("Email da ton tai trong he thong");
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullName: fullName.trim(),
    email: normalizedEmail,
    passwordHash,
    role: "user",
    isActive: true
  });

  return {
    token: createToken(user),
    user: sanitizeUser(user)
  };
};

const login = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user || !user.isActive) {
    const error = new Error("Thong tin dang nhap khong hop le");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordMatched = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordMatched) {
    const error = new Error("Thong tin dang nhap khong hop le");
    error.statusCode = 401;
    throw error;
  }

  return {
    token: createToken(user),
    user: sanitizeUser(user)
  };
};

const getProfileById = async (userId) => {
  const user = await User.findById(userId).lean();

  if (!user || !user.isActive) {
    const error = new Error("Khong tim thay tai khoan");
    error.statusCode = 401;
    throw error;
  }

  return {
    id: user._id.toString(),
    fullName: user.fullName,
    email: user.email,
    role: user.role
  };
};

module.exports = {
  ensureDefaultAdmin,
  register,
  login,
  getProfileById,
  JWT_SECRET
};
