const mongoose = require("mongoose");

const reimbursementSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, required: true },
  category: {
    type: String,
    enum: ["Travel", "Meals", "Equipment", "Medical", "Other"],
    required: true,
  },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ["Pending", "Manager Approved", "Approved", "Rejected"],
    default: "Pending",
  },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reviewedAt: { type: Date },
  comments: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Reimbursement = mongoose.model("Reimbursement", reimbursementSchema);
module.exports = Reimbursement;
