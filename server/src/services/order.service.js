const Order = require("../models/order");
const Product = require("../models/product");

const getShippingFee = (subtotal) => {
  return subtotal >= 30000000 ? 0 : 99000;
};

const createOrder = async (payload, currentUser = null) => {
  const { customer, items, paymentMethod } = payload;

  if (!customer?.fullName || !customer?.email || !customer?.phone || !customer?.address) {
    const error = new Error("Vui long nhap day du thong tin nhan hang");
    error.statusCode = 400;
    throw error;
  }

  if (!Array.isArray(items) || !items.length) {
    const error = new Error("Gio hang dang trong");
    error.statusCode = 400;
    throw error;
  }

  const productIds = items.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: productIds }, isActive: true });
  const productMap = new Map(products.map((product) => [String(product._id), product]));

  const normalizedItems = items.map((item) => {
    const product = productMap.get(String(item.productId));

    if (!product) {
      const error = new Error("Co san pham khong hop le trong gio hang");
      error.statusCode = 400;
      throw error;
    }

    const quantity = Math.max(1, Number(item.quantity) || 1);
    const lineTotal = product.price * quantity;

    return {
      product: product._id,
      name: product.name,
      brand: product.brand,
      image: product.image,
      quantity,
      unitPrice: product.price,
      lineTotal
    };
  });

  const subtotal = normalizedItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const shippingFee = getShippingFee(subtotal);
  const totalAmount = subtotal + shippingFee;

  return Order.create({
    user: currentUser?.id || null,
    customer: {
      fullName: customer.fullName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      note: customer.note || ""
    },
    items: normalizedItems,
    paymentMethod: paymentMethod || "cod",
    subtotal,
    shippingFee,
    totalAmount
  });
};

module.exports = {
  createOrder
};
