import Order from "./order.model.js";
import ApiError from "../../common/utils/api-error.js";
import { getIO } from "../../common/socket/socket.js";

/**
 * Create a new order tied to a guest session.
 * Emits 'order:new' to the admin room via Socket.io.
 */
const createOrder = async ({
  tableNumber,
  restaurantSlug,
  guestId,
  items,
  subtotal,
  tax,
  total,
  specialInstructions = "",
}) => {
  const order = await Order.create({
    tableNumber,
    restaurantSlug,
    guest: guestId,
    items,
    subtotal,
    tax,
    total,
    specialInstructions,
    status: "received",
  });

  // Populate guest name for admin card display
  await order.populate("guest", "name tableNumber");

  // Emit to admin room in real-time
  try {
    getIO().to("admin").emit("order:new", order);
  } catch {
    // Socket may not be in use in tests — don't crash
  }

  return order;
};

/**
 * Get all orders for a specific table (guest use).
 */
const getOrdersByTable = async (tableNumber, restaurantSlug) => {
  return Order.find({ tableNumber, restaurantSlug }).sort({ createdAt: -1 });
};

/**
 * Update order status (admin use). Emits 'order:status' to the table room.
 */
const updateOrderStatus = async (orderId, status) => {
  const validStatuses = ["received", "preparing", "ready", "served"];
  if (!validStatuses.includes(status)) {
    throw ApiError.badRequest(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
  }

  const order = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  ).populate("guest", "name tableNumber");

  if (!order) throw ApiError.notfound("Order not found");

  // Notify the guest's table room
  try {
    getIO()
      .to(`table-${order.tableNumber}`)
      .emit("order:status", { orderId: order._id, status: order.status });
  } catch {
    // Safe to ignore in non-socket contexts
  }

  return order;
};

/**
 * Get all orders — admin use. Supports filtering by status and tableNumber.
 */
const getAllOrders = async ({ status, tableNumber, restaurantSlug, limit = 100, skip = 0 } = {}) => {
  const filter = {};
  if (status) filter.status = status;
  if (tableNumber) filter.tableNumber = tableNumber;
  if (restaurantSlug) filter.restaurantSlug = restaurantSlug;

  return Order.find(filter)
    .populate("guest", "name email phone isCouple")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

/**
 * Get a single order by ID.
 */
const getOrderById = async (orderId) => {
  const order = await Order.findById(orderId).populate("guest", "name email phone");
  if (!order) throw ApiError.notfound("Order not found");
  return order;
};

export { createOrder, getOrdersByTable, updateOrderStatus, getAllOrders, getOrderById };
