require("dotenv").config();
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const { connectDB } = require("./src/db");
const { User } = require("./src/models");

const args = process.argv.slice(2);
const emailInput = args[0] ? args[0].trim().toLowerCase() : null;
const newPasswordInput = args[1] ? args[1].trim() : null;

if (!emailInput || !newPasswordInput) {
  console.log("Usage: node reset-student-password.js <student-email> <new-password>");
  console.log("Example: node reset-student-password.js dishamarne1@gmail.com Disha@123");
  process.exit(1);
}

if (newPasswordInput.length < 6) {
  console.error("Error: Password must be at least 6 characters.");
  process.exit(1);
}

(async () => {
  try {
    await connectDB();
    const cleanDigits = emailInput.replace(/\D/g, "");
    const user = await User.findOne({
      $or: [
        { email: emailInput },
        { email: new RegExp("^" + emailInput.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$", "i") },
        cleanDigits.length >= 10 ? { phone: cleanDigits } : null,
        cleanDigits.length >= 10 ? { mobile: cleanDigits } : null
      ].filter(Boolean)
    });

    if (!user) {
      console.error(`User with email/phone "${emailInput}" not found in MongoDB.`);
      process.exit(1);
    }

    const newHash = bcrypt.hashSync(newPasswordInput, 10);
    user.passwordHash = newHash;
    await user.save();

    // Also sync to local data/db.json if it exists
    const dbFile = path.join(__dirname, "data/db.json");
    if (fs.existsSync(dbFile)) {
      try {
        const db = JSON.parse(fs.readFileSync(dbFile, "utf8"));
        const u = (db.users || []).find(x => x.email && x.email.toLowerCase() === emailInput);
        if (u) {
          u.passwordHash = newHash;
          fs.writeFileSync(dbFile, JSON.stringify(db, null, 2), "utf8");
        }
      } catch (_) {}
    }

    console.log(`✅ Password successfully updated for ${user.name} (${user.email})!`);
    console.log(`New password: ${newPasswordInput}`);
    process.exit(0);
  } catch (err) {
    console.error("Reset failed:", err.message);
    process.exit(1);
  } finally {
    const mongoose = require("mongoose");
    await mongoose.disconnect().catch(() => {});
  }
})();
