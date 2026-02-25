const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/User");

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const users = await User.find({}, "name email role");
  console.log("USERS:", users);
  process.exit(0);
});
