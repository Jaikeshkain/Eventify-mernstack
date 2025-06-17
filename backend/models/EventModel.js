const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  subtitle:{type:String,require:true},
  description: { type: String },
  tags: [{ type: String }],
  category: { type: String },
  images: [{ url: { type: String }, publicId: { type: String } }],
  location: {
    venue: { type: String },
    address: { type: String },
    link: { type: String }
  },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  type: { type: String, enum: ['virtual', 'in-person'], default: 'in-person' },
  price: { type: Number, default: 0 },
  capacity: { type: Number, default: 100 },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  qrCodes: [{ type: String }],
  aiMeta: {
    aiDescription: String,
    aiTags: [String],
    emailSubjectLine: String
  },
  status:{type:String,enum:['live','upcoming','draft','ended'],default:'draft'},
},{timestamps: true});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
