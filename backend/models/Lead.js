const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  source: { type: String },
  status: { type: String, enum: ['New', 'Contacted', 'Qualified', 'Lost', 'Won'], default: 'New' },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  notes: [{ content: String, createdAt: { type: Date, default: Date.now } }],
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Lead', leadSchema);