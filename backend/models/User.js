const mongoose = require('mongoose');

const masterySchema = new mongoose.Schema({
  topic:     { type: String, required: true },
  subject:   { type: String, default: 'Math' },
  p_l:       { type: Number, default: 0.3 },
  bestScore: { type: Number, default: 0 },
  attempts:  { type: Number, default: 0 }
});

const userSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  email:      { type: String, required: true, unique: true },
  password:   { type: String, required: true },
  mastery:    [masterySchema],
  streak:     { type: Number, default: 0 },
  lastActive: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);