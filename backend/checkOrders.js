import "dotenv/config";
import mongoose from "mongoose";
import Order from "./src/modules/order/order.model.js";

async function checkOrders() {
  await mongoose.connect(process.env.MONGO_URI);
  const orders = await Order.find().sort({ createdAt: -1 }).limit(5);
  console.log(JSON.stringify(orders.map(o => ({ id: o._id, status: o.status, table: o.tableNumber })), null, 2));
  process.exit(0);
}
checkOrders();
