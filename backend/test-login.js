require("dotenv").config();
const bcrypt = require("bcryptjs");
const { connectDB } = require("./src/db");
const { User } = require("./src/models");

(async () => {
  try {
    await connectDB();

    const student = await User.findOne({
      email: "student@abhyas.local"
    });

    const admin = await User.findOne({
      email: "admin@abhyas.local"
    });

    async function testLogin(email, password) {
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      console.log(
        email + " API login:",
        response.status,
        data.user ? "SUCCESS (" + data.user.role + ")" : (data.error || "FAILED")
      );
    }

    console.log(
      "Student demo password matches:",
      student ? bcrypt.compareSync("Student123!", student.passwordHash) : "ACCOUNT NOT FOUND"
    );

    if (admin) {
      console.log(
        "Admin default password matches:",
        bcrypt.compareSync("ChangeMe123!", admin.passwordHash)
      );

      if (process.env.ADMIN_PASSWORD) {
        console.log(
          "Admin configured password matches:",
          bcrypt.compareSync(process.env.ADMIN_PASSWORD, admin.passwordHash)
        );
      } else {
        console.log("ADMIN_PASSWORD configured: No");
      }
    } else {
      console.log("Admin account: NOT FOUND");
    }

    await testLogin("student@abhyas.local", "Student123!");
    await testLogin("admin@abhyas.local", "ChangeMe123!");

    if (process.env.ADMIN_PASSWORD) {
      await testLogin("admin@abhyas.local", process.env.ADMIN_PASSWORD);
    }

    process.exit(0);
  } catch (e) {
    console.error("Test failed:", e.message);
    process.exit(1);
  }
})();
