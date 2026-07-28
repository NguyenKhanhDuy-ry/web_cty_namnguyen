const orderService = require("../services/order.service");

const createOrder = async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.body, req.user);

    return res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder
};
