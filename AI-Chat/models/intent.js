const mongoose = require('mongoose');

const intentSchema = new mongoose.Schema({
  intent: String,
  utterances: [String],
  responses: [String],
});

module.exports = mongoose.model('Intent', intentSchema);
