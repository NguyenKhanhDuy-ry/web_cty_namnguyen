require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");
const authService = require("./src/services/auth.service");
const adminService = require("./src/services/admin.service");
const productService = require("./src/services/product.service");
const { configureCloudinary } = require("./src/config/cloudinary");

const PORT = process.env.PORT || 9999;

const startServer = async () => {
  try {
    configureCloudinary();
    await connectDB();
    await authService.ensureDefaultAdmin();
    await adminService.ensureSampleData();
    await productService.ensureSampleProducts();

    app.listen(PORT, () => {
      console.log(`Server đang chạy tại http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Không thể khởi động server: ", error.message);
    process.exit(1);
  }
};

startServer();
