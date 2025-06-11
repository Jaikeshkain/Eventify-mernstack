const mongoose = require("mongoose");

const qrGenerationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  quantity: Number,
  amount: Number,
  upiId: String,
  qrLink: String,
  status: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending",
  },
  proofImageUrl: {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  userTxnId: String,
  verifiedAt: Date,
}, { timestamps: true });

const QRGeneration = mongoose.model("QRGeneration", qrGenerationSchema);

module.exports = QRGeneration;
