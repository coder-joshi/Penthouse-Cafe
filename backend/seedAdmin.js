import "dotenv/config";
import mongoose from "mongoose";
import User from "./src/modules/auth/auth.model.js";

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Check if admin exists
    const existing = await User.findOne({ email: "admin@penthouse.com" });
    if (existing) {
      console.log("Admin already exists. Deleting to reset...");
      await User.deleteOne({ email: "admin@penthouse.com" });
    }

    const admin = new User({
      name: "Admin",
      email: "admin@penthouse.com",
      password: "adminpassword", // Mongoose pre-save hook will hash this
      role: "admin",
      isVerified: true
    });
    await admin.save();
    console.log("SUCCESS: Admin created!");
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
}

createAdmin();
