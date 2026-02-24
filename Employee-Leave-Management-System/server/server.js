const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const fs = require("fs");
const logStream = fs.createWriteStream("server_debug.log", { flags: "a" });
const log = (msg) => {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  console.log(msg);
  logStream.write(line);
};

// Load environment variables
dotenv.config();

log("Server starting...");
log(`MONGO_URI: ${process.env.MONGO_URI}`);

// Connect to Database
connectDB()
  .then(() => log("DB connection process finished (success or handled error)"))
  .catch((err) => log(`Initial DB connection failed: ${err.message}`));

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/leaves", require("./routes/leaveRoutes"));
app.use("/api/reimbursements", require("./routes/reimbursementRoutes"));

app.get("/", (req, res) => {
  res.json({ message: "ELMS API is running..." });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
