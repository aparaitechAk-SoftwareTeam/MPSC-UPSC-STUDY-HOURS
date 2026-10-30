require("dotenv").config();

const { connectDB } = require("./src/db");
const { User } = require("./src/models");

(async () => {
  try {
    await connectDB();

    console.log("Total users:", await User.countDocuments());
    console.log("Student accounts:", await User.countDocuments({ role: "student" }));
    console.log("Admin accounts:", await User.countDocuments({ role: "admin" }));

    const admin = await User.findOne({
      email: "admin@abhyas.local"
    }).select("email role").lean();

    console.log(
      "Default admin account:",
      admin ? JSON.stringify(admin) : "NOT FOUND"
    );

    process.exit(0);
  } catch (error) {
    console.error("Diagnostic error:", error.message);
    process.exit(1);
  }
})();
