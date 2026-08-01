const Product = require("../models/product");

const getProducts = async (queryParams) => {
  const { keyword, category, brand, priceMin, priceMax, stockStatus, sort = "newest", page = 1, limit = 12 } = queryParams;

  const query = { isActive: true };

  if (keyword) {
    query.name = { $regex: keyword, $options: "i" };
  }
  if (category) {
    query.category = category;
  }
  if (brand) {
    query.brand = brand;
  }
  if (priceMin || priceMax) {
    query.price = {};
    if (priceMin) query.price.$gte = Number(priceMin);
    if (priceMax) query.price.$lte = Number(priceMax);
  }
  if (stockStatus === "in-stock") query.stock = { $gt: 0 };
  if (stockStatus === "out-of-stock") query.stock = { $eq: 0 };

  const sortOptions = {};
  if (sort === "lowest-price") sortOptions.price = 1;
  else if (sort === "highest-price") sortOptions.price = -1;
  else if (sort === "best-selling") sortOptions.reviewCount = -1;
  else sortOptions.createdAt = -1;

  const skip = (Number(page) - 1) * Number(limit);

  const [products, totalProducts] = await Promise.all([
    Product.find(query).sort(sortOptions).skip(skip).limit(Number(limit)).lean(),
    Product.countDocuments(query)
  ]);

  return {
    products,
    totalProducts,
    totalPages: Math.ceil(totalProducts / Number(limit)),
    currentPage: Number(page)
  };
};

const getProductById = async (productId) => {
  return Product.findById(productId).lean();
};

const ensureSampleProducts = async () => {
  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    console.log("Không có sản phẩm nào, đang tạo dữ liệu mẫu...");
    const sampleProducts = [
      {
        brand: "ASUS",
        category: "Laptop Gaming",
        name: "ASUS ROG Strix G16 2024",
        slug: "asus-rog-strix-g16-2024",
        price: 52990000,
        oldPrice: 62990000,
        stock: 10,
        thumbnail: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80",
        images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80"],
        specs: {
          cpu: "i9-14900HX",
          ram: "32GB DDR5",
          ssd: "1TB NVMe",
          gpu: "RTX 4080 12GB",
          display: '16" QHD+ 240Hz'
        }
      },
      {
        brand: "APPLE",
        category: "MacBook",
        name: 'Apple MacBook Pro 16" M4 Max',
        slug: "apple-macbook-pro-16-m4-max",
        price: 89990000,
        oldPrice: 95990000,
        stock: 5,
        thumbnail: "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
        images: ["https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=1200&q=80"],
        specs: {
          cpu: "M4 Max 16-core",
          ram: "48GB Unified Memory",
          ssd: "1TB SSD",
          gpu: "40-core GPU",
          display: '16" Liquid Retina XDR'
        }
      }
    ];
    await Product.insertMany(sampleProducts);
  }
};

module.exports = {
  getProducts,
  getProductById,
  ensureSampleProducts
};