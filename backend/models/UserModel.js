const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['attendee', 'organizer', 'admin'], default: 'attendee' },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }],
},{timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;
