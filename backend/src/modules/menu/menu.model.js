import mongoose from "mongoose";

const customizationOptionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    extraPrice: { type: Number, default: 0 },
  },
  { _id: false }
);

const customizationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, enum: ["radio", "checkbox"], required: true },
    options: [customizationOptionSchema],
  },
  { _id: false }
);

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    isVeg: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
    spiceLevel: { type: Number, enum: [0, 1, 2, 3], default: 0 },
    image: { type: String, default: "" },
    customizations: [customizationSchema],
    tags: [{ type: String, trim: true }],
    restaurantSlug: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("MenuItem", menuItemSchema);
