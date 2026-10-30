require("dotenv").config();
const { connectDB } = require("./src/db");
const { User } = require("./src/models");

(async () => {
  try {
    await connectDB();
    const users = await User.find({}, "email role").lean();
    console.log("Existing accounts:");
    users.forEach((u) => console.log(`${u.email} | ${u.role}`));
    process.exit(0);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
})();
