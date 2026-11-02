require("dotenv").config();
const bcrypt = require("bcryptjs");
const { connectDB } = require("./src/db");
const { User } = require("./src/models");

(async () => {
  try {
    const password = process.env.NEW_ADMIN_PASSWORD;
    if (!password || password.length < 12) {
      throw new Error("Password must contain at least 12 characters.");
    }

    await connectDB();

    const admin = await User.findOne({ email: "admin@abhyas.local" });
    if (!admin) throw new Error("Admin account not found.");

    admin.passwordHash = bcrypt.hashSync(password, 10);
    await admin.save();

    console.log("Admin password updated successfully.");
  } catch (error) {
    console.error("Password reset failed:", error.message);
    process.exitCode = 1;
  } finally {
    const mongoose = require("mongoose");
    await mongoose.disconnect().catch(() => {});
  }
})();
