const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  provider: { type: String, enum: ['stripe', 'razorpay'], required: true },
  amount: Number,
  currency: String,
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  providerOrderId: String,
  providerPaymentId: String,
},{timestamps: true});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
