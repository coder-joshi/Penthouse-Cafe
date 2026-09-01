import mongoose from "mongoose";

const guestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
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
    isCouple: {
      type: Boolean,
      default: false,
    },
    partnerName: { type: String, trim: true, default: null },
    partnerEmail: { type: String, trim: true, lowercase: true, default: null },
    partnerPhone: { type: String, trim: true, default: null },

    // Hashed session token — raw token goes to the client, never stored
    sessionToken: {
      type: String,
      required: true,
      select: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Guest", guestSchema);
