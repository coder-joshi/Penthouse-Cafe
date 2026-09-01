import apiResponse from "../../common/utils/api-response.js";
import * as orderService from "./order.service.js";

// POST /api/v1/orders — guest creates an order
const createOrder = async (req, res) => {
  const {
    items,
    subtotal,
    tax,
    total,
    specialInstructions,
    tableNumber,
    restaurantSlug,
  } = req.body;

  const order = await orderService.createOrder({
    tableNumber: tableNumber || req.guest.tableNumber,
    restaurantSlug: restaurantSlug || req.guest.restaurantSlug,
    guestId: req.guest._id,
    items,
    subtotal,
    tax,
    total,
    specialInstructions,
  });

  apiResponse.created(res, "Order placed successfully", order);
};

// GET /api/v1/orders/table/:tableNumber — guest views their table's orders
const getOrdersByTable = async (req, res) => {
  const { tableNumber } = req.params;
  const { restaurantSlug } = req.query;
  const orders = await orderService.getOrdersByTable(tableNumber, restaurantSlug);
  apiResponse.ok(res, "Orders fetched", orders);
};

// GET /api/v1/orders — admin list with filters
const getAllOrders = async (req, res) => {
  const { status, tableNumber, restaurantSlug, limit, skip } = req.query;
  const orders = await orderService.getAllOrders({
    status,
    tableNumber,
    restaurantSlug,
    limit: limit ? parseInt(limit) : 100,
    skip: skip ? parseInt(skip) : 0,
  });
  apiResponse.ok(res, "Orders fetched", orders);
};

// PATCH /api/v1/orders/:orderId/status — admin updates status
const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const order = await orderService.updateOrderStatus(orderId, status);
  apiResponse.ok(res, "Order status updated", order);
};

// GET /api/v1/orders/:orderId — get a single order
const getOrderById = async (req, res) => {
  const order = await orderService.getOrderById(req.params.orderId);
  apiResponse.ok(res, "Order fetched", order);
};

export { createOrder, getOrdersByTable, getAllOrders, updateOrderStatus, getOrderById };
