const mongoose = require('mongoose');

const corpusSchema = new mongoose.Schema({
  intent: { type: String, required: true, unique: true },
  utterances: [String],
  responses: [String]
});

const Corpus = mongoose.model('Intent', corpusSchema);

module.exports = Corpus;
