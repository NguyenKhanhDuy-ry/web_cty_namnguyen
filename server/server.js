require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");
const { ensureDefaultAdmin } = require("./src/services/auth.service");
const { ensureSampleProducts } = require("./src/services/product.service");

const PORT = process.env.PORT || 9999;

const startServer = async () => {
  try {
    await connectDB();
    await ensureDefaultAdmin();
    await ensureSampleProducts();

    app.listen(PORT, () => {
      console.log(`Server đang chạy tại http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Không thể khởi động server:", error.message);
    process.exit(1);
  }
};

startServer();
