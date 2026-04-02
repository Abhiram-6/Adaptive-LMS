const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  topic:       { type: String, required: true },
  subject:     { type: String, required: true },
  text:        { type: String, required: true },
  options:     [String],
  answer:      { type: String, required: true },
  explanation: { type: String },
  difficulty:  { type: Number, min: 1, max: 5, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);