import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    menuItemId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    customizations: [
      {
        customizationId: String,
        label: String,
        value: String,
        extraPrice: { type: Number, default: 0 },
      },
    ],
    specialInstructions: { type: String, default: "" },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    tableNumber: {
      type: String,
      required: [true, "Table number is required"],
      trim: true,
    },
    restaurantSlug: {
      type: String,
      required: [true, "Restaurant slug is required"],
      trim: true,
    },
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guest",
      required: true,
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (v) => v.length > 0,
        message: "Order must have at least one item",
      },
    },
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },
    specialInstructions: { type: String, default: "" },
    status: {
      type: String,
      enum: ["received", "preparing", "ready", "served"],
      default: "received",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
