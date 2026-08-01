const bcrypt = require("bcryptjs");

const Category = require("../models/category");
const Lead = require("../models/lead");
const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");

const ORDER_STATUSES = ["pending", "confirmed", "shipping", "completed", "cancelled"];
const LEAD_STATUSES = ["new", "contacted", "qualified", "closed"];
const USER_ROLES = ["admin", "user"];

const sanitizeUser = (user) => ({
  id: user._id.toString(),
  fullName: user.fullName,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

const parseBoolean = (value, defaultValue = false) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    if (value === "true") return true;
    if (value === "false") return false;
  }

  return defaultValue;
};

const slugify = (value = "") =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeProductPayload = (payload = {}, baseProduct = {}) => {
  const name = (payload.name ?? baseProduct.name ?? "").trim();
  const slugSource = (payload.slug ?? baseProduct.slug ?? name).trim();
  const brand = (payload.brand ?? baseProduct.brand ?? "").trim();
  const category = (payload.category ?? baseProduct.category ?? "").trim();

  if (!name || !brand || !category) {
    const error = new Error("Tên, thương hiệu và danh mục sản phẩm là bắt buộc");
    error.statusCode = 400;
    throw error;
  }

  const slug = slugify(slugSource);

  if (!slug) {
    const error = new Error("Slug sản phẩm không hợp lệ");
    error.statusCode = 400;
    throw error;
  }

  return {
    slug,
    name,
    brand,
    category,
    shortDescription: (payload.shortDescription ?? baseProduct.shortDescription ?? "").trim(),
    description: (payload.description ?? baseProduct.description ?? "").trim(),
    price: Number(payload.price ?? baseProduct.price ?? 0),
    oldPrice: Number(payload.oldPrice ?? baseProduct.oldPrice ?? 0),
    stock: Number(payload.stock ?? baseProduct.stock ?? 0),
    images: Array.isArray(payload.images) ? payload.images : [],
    thumbnail: (payload.thumbnail || (Array.isArray(payload.images) && payload.images.length > 0 ? payload.images[0] : baseProduct.thumbnail) || "").trim(),
    badge: (payload.badge ?? baseProduct.badge ?? "").trim(),
    rating: Number(payload.rating ?? baseProduct.rating ?? 4.8),
    reviewCount: Number(payload.reviewCount ?? baseProduct.reviewCount ?? 0),
    featured: parseBoolean(payload.featured, baseProduct.featured ?? false),
    isActive: parseBoolean(payload.isActive, baseProduct.isActive ?? true),
    specs: {
      cpu: (payload.specs?.cpu ?? baseProduct.specs?.cpu ?? "").trim(),
      ram: (payload.specs?.ram ?? baseProduct.specs?.ram ?? "").trim(),
      ssd: (payload.specs?.ssd ?? baseProduct.specs?.ssd ?? "").trim(),
      gpu: (payload.specs?.gpu ?? baseProduct.specs?.gpu ?? "").trim(),
      display: (payload.specs?.display ?? baseProduct.specs?.display ?? "").trim(),
      gallery: Array.isArray(payload.specs?.gallery) ? payload.specs.gallery : [],
      ports: (payload.specs?.ports ?? baseProduct.specs?.ports ?? "").trim(),
      os: (payload.specs?.os ?? baseProduct.specs?.os ?? "").trim(),
      weight: (payload.specs?.weight ?? baseProduct.specs?.weight ?? "").trim(),
      dimensions: (payload.specs?.dimensions ?? baseProduct.specs?.dimensions ?? "").trim(),
      color: (payload.specs?.color ?? baseProduct.specs?.color ?? "").trim()
    }
  };
};

const ensureUniqueUserEmail = async (email, ignoredUserId = null) => {
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({
    email: normalizedEmail,
    ...(ignoredUserId ? { _id: { $ne: ignoredUserId } } : {})
  });

  if (existingUser) {
    const error = new Error("Email đã tồn tại trong hệ thống");
    error.statusCode = 409;
    throw error;
  }

  return normalizedEmail;
};

const ensureUniqueProductSlug = async (slug, ignoredProductId = null) => {
  const existingProduct = await Product.findOne({
    slug,
    ...(ignoredProductId ? { _id: { $ne: ignoredProductId } } : {})
  });

  if (existingProduct) {
    const error = new Error("Slug sản phẩm đã tồn tại");
    error.statusCode = 409;
    throw error;
  }
};

const getDashboard = async () => {
  const [
    totalUsers,
    totalProducts,
    totalOrders,
    totalLeads,
    pendingOrders,
    newLeads,
    activeProducts,
    recentOrders,
    lowStockProducts,
    revenueAggregate
  ] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
    Lead.countDocuments(),
    Order.countDocuments({ status: "pending" }),
    Lead.countDocuments({ status: "new" }),
    Product.countDocuments({ isActive: true }),
    Order.find().sort({ createdAt: -1 }).limit(5).lean(),
    Product.find({ isActive: true, stock: { $lte: 5 } }).sort({ stock: 1, createdAt: -1 }).limit(5).lean(),
    Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" }
        }
      }
    ])
  ]);

  return {
    stats: {
      totalUsers,
      totalProducts,
      totalOrders,
      totalLeads,
      pendingOrders,
      newLeads,
      activeProducts,
      totalRevenue: revenueAggregate[0]?.totalRevenue || 0
    },
    recentOrders,
    lowStockProducts
  };
};

const getUsers = async () => {
  const users = await User.find().sort({ createdAt: -1 }).lean();
  return users.map(sanitizeUser);
};

const createUser = async ({ fullName = "", email = "", password = "", role = "user" }) => {
  if (!fullName.trim() || !email.trim() || !password.trim()) {
    const error = new Error("Họ tên, email và mật khẩu là bắt buộc");
    error.statusCode = 400;
    throw error;
  }

  if (password.trim().length < 6) {
    const error = new Error("Mật khẩu phải có ít nhất 6 ký tự");
    error.statusCode = 400;
    throw error;
  }

  if (!USER_ROLES.includes(role)) {
    const error = new Error("Vai trò người dùng không hợp lệ");
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = await ensureUniqueUserEmail(email);
  const passwordHash = await bcrypt.hash(password.trim(), 10);

  const user = await User.create({
    fullName: fullName.trim(),
    email: normalizedEmail,
    passwordHash,
    role,
    isActive: true
  });

  return sanitizeUser(user);
};

const updateUser = async (userId, payload = {}, currentUser) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("Không tìm thấy tài khoản");
    error.statusCode = 404;
    throw error;
  }

  const isEditingSelf = currentUser?.id === userId;

  if (isEditingSelf && payload.role && payload.role !== user.role) { // eslint-disable-line
    const error = new Error("Bạn không thể tự thay đổi vai trò của chính mình");
    error.statusCode = 400;
    throw error;
  }

  if (isEditingSelf && payload.isActive === false) { // eslint-disable-line
    const error = new Error("Bạn không thể tự khóa tài khoản của chính mình");
    error.statusCode = 400;
    throw error;
  }

  if (typeof payload.fullName === "string" && payload.fullName.trim()) {
    user.fullName = payload.fullName.trim();
  }

  if (typeof payload.email === "string" && payload.email.trim()) {
    user.email = await ensureUniqueUserEmail(payload.email, userId);
  }

  if (typeof payload.role === "string") {
    if (!USER_ROLES.includes(payload.role)) {
      const error = new Error("Vai trò người dùng không hợp lệ");
      error.statusCode = 400;
      throw error;
    }

    user.role = payload.role;
  }

  if (typeof payload.isActive !== "undefined") {
    user.isActive = parseBoolean(payload.isActive, user.isActive);
  }

  if (typeof payload.password === "string" && payload.password.trim()) {
    if (payload.password.trim().length < 6) {
      const error = new Error("Mật khẩu phải có ít nhất 6 ký tự");
      error.statusCode = 400;
      throw error;
    }

    user.passwordHash = await bcrypt.hash(payload.password.trim(), 10);
  }

  await user.save();
  return sanitizeUser(user);
};

const getProducts = async () => {
  return Product.find().sort({ createdAt: -1 }).lean();
};

const createProduct = async (payload = {}) => {
  const normalizedPayload = normalizeProductPayload(payload);
  await ensureUniqueProductSlug(normalizedPayload.slug);
  return Product.create(normalizedPayload);
};

const updateProduct = async (productId, payload = {}) => {
  const product = await Product.findById(productId);

  if (!product) {
    const error = new Error("Không tìm thấy sản phẩm");
    error.statusCode = 404;
    throw error;
  }

  const normalizedPayload = normalizeProductPayload(payload, product);
  await ensureUniqueProductSlug(normalizedPayload.slug, productId);

  Object.assign(product, normalizedPayload);
  await product.save();

  return product;
};

const deleteProduct = async (productId) => {
  const product = await Product.findByIdAndDelete(productId);

  if (!product) {
    const error = new Error("Không tìm thấy sản phẩm để xóa");
    error.statusCode = 404;
    throw error;
  }

  return { message: "Sản phẩm đã được xóa thành công." };
};

const getCategories = async () => {
  return Category.find().sort({ name: 1 }).lean();
};

const createCategory = async (payload = {}) => {
  const name = (payload.name || "").trim();
  if (!name) {
    const error = new Error("Tên danh mục là bắt buộc");
    error.statusCode = 400;
    throw error;
  }

  const slug = payload.slug ? slugify(payload.slug) : slugify(name);
  const existing = await Category.findOne({ $or: [{ name }, { slug }] });
  if (existing) {
    const error = new Error("Tên hoặc slug danh mục đã tồn tại");
    error.statusCode = 409;
    throw error;
  }

  return Category.create({ name, slug, description: (payload.description || "").trim() });
};

const updateCategory = async (categoryId, payload = {}) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    const error = new Error("Không tìm thấy danh mục");
    error.statusCode = 404;
    throw error;
  }

  if (payload.name) category.name = payload.name.trim();
  if (payload.slug) category.slug = slugify(payload.slug);
  if (payload.description) category.description = payload.description.trim();

  await category.save();
  return category;
};

const deleteCategory = async (categoryId) => {
  const category = await Category.findByIdAndDelete(categoryId);
  if (!category) {
    const error = new Error("Không tìm thấy danh mục để xóa");
    error.statusCode = 404;
    throw error;
  }
  return { message: "Danh mục đã được xóa thành công." };
};

const getOrders = async () => {
  return Order.find().sort({ createdAt: -1 }).lean();
};

const updateOrderStatus = async (orderId, status) => {
  if (!ORDER_STATUSES.includes(status)) {
    const error = new Error("Trạng thái đơn hàng không hợp lệ");
    error.statusCode = 400;
    throw error;
  }

  const order = await Order.findById(orderId);

  if (!order) {
    const error = new Error("Không tìm thấy đơn hàng");
    error.statusCode = 404;
    throw error;
  }

  order.status = status;
  await order.save();

  return order;
};

const getLeads = async () => {
  return Lead.find().sort({ createdAt: -1 }).lean();
};

const updateLeadStatus = async (leadId, status) => {
  if (!LEAD_STATUSES.includes(status)) {
    const error = new Error("Trạng thái lead không hợp lệ");
    error.statusCode = 400;
    throw error;
  }

  const lead = await Lead.findById(leadId);

  if (!lead) {
    const error = new Error("Không tìm thấy lead");
    error.statusCode = 404;
    throw error;
  }

  lead.status = status;
  await lead.save();

  return lead;
};

const ensureSampleData = async () => {
  const categoryCount = await Category.countDocuments();
  if (categoryCount !== 3) {
    await Category.deleteMany({});
    await Category.insertMany([
      { name: "Laptop Gaming", slug: "laptop-gaming", description: "Laptop hiệu năng cao cho game thủ" },
      { name: "Laptop Văn phòng", slug: "laptop-van-phong", description: "Laptop mỏng nhẹ cho công việc" },
      { name: "MacBook", slug: "macbook", description: "Laptop cao cấp từ Apple" }
    ]);
  }
};

module.exports = {
  ORDER_STATUSES,
  LEAD_STATUSES,
  USER_ROLES,
  getDashboard,
  getUsers,
  createUser,
  updateUser,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getOrders,
  updateOrderStatus,
  getLeads,
  updateLeadStatus,
  ensureSampleData
};
