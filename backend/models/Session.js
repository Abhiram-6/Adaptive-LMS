const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  questionId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  questionText: String,
  correct:      Boolean,
  p_l_after:    Number,
  weakArea:     String
});

const sessionSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  topic:     String,
  responses: [responseSchema]
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);