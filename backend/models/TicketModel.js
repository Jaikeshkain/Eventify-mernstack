const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  qrCode: { type: String },
  status: { type: String, enum: ['booked', 'cancelled','pending','expired'], default: 'pending' },
  qrGeneration: { type: mongoose.Schema.Types.ObjectId, ref: 'QRGeneration' },
},{timestamps: true});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
