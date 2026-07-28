const Product = require("../models/product");
const sampleProducts = require("../data/sample-products");

const getProducts = async (query) => {
  const filter = {
    isActive: query.includeInactive === "true" ? { $in: [true, false] } : true
  };

  if (query.keyword) {
    filter.name = {
      $regex: query.keyword,
      $options: "i"
    };
  }

  if (query.category) {
    filter.category = query.category;
  }

  if (query.featured === "true") {
    filter.featured = true;
  }

  const limit = Number(query.limit) > 0 ? Number(query.limit) : 0;

  let request = Product.find(filter).sort({ featured: -1, createdAt: -1 });

  if (limit) {
    request = request.limit(limit);
  }

  return request;
};

const getProductById = async (productId) => {
  const product = await Product.findById(productId);

  if (!product) {
    const error = new Error("Không tìm thấy sản phẩm");
    error.statusCode = 404;
    throw error;
  }

  return product;
};

const createProduct = async (productData) => {
  return Product.create(productData);
};

const ensureSampleProducts = async () => {
  const existingCount = await Product.countDocuments();

  if (existingCount > 0) {
    return existingCount;
  }

  await Product.insertMany(sampleProducts);
  return sampleProducts.length;
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  ensureSampleProducts
};
