const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const fs = require("fs");

dotenv.config();

const logFile = "diagnose_report.txt";
const log = (msg) => {
  console.log(msg);
  fs.appendFileSync(logFile, msg + "\n");
};

if (fs.existsSync(logFile)) fs.unlinkSync(logFile);

const diagnose = async () => {
  log("Starting Diagnosis...");
  log(`Time: ${new Date().toISOString()}`);

  try {
    log(`Connecting to: ${process.env.MONGO_URI}`);
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    log("Successfully connected to MongoDB!");

    const userCount = await User.countDocuments();
    log(`Total users in database: ${userCount}`);

    const users = await User.find({});
    for (const user of users) {
      log(`- User: ${user.email}, Role: ${user.role}`);
      const testPasswords = ["Admin@123", "Manager@123", "Emp@123"];
      let matched = false;
      for (const pw of testPasswords) {
        if (await bcrypt.compare(pw, user.password)) {
          log(`  * Password MATCH found for: ${pw}`);
          matched = true;
          break;
        }
      }
      if (!matched) {
        log("  * [WARNING] No password match found for this user!");
      }
    }

    log("Diagnosis complete.");
    process.exit(0);
  } catch (error) {
    log(`[ERROR] ${error.message}`);
    if (error.message.includes("ECONNREFUSED")) {
      log("HELP: It looks like MongoDB is not running on the specified port.");
    }
    process.exit(1);
  }
};

diagnose();
