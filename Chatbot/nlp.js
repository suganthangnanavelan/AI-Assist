const mongoose = require('mongoose');
const { dockStart } = require('@nlpjs/basic');

// MongoDB connection URI
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nlp_corpus';

// Define a schema for intents in MongoDB with `utterances` and `responses`
const intentSchema = new mongoose.Schema({
  intent: { type: String, required: true, unique: true },
  utterances: [String],
  responses: [String],
});

// Create a model from the schema, explicitly specify the collection name as 'corpus'
const Intent = mongoose.model('Intent', intentSchema, 'corpus'); // 'corpus' is the collection name

let nlp;

(async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Start NLP dock
    const dock = await dockStart({ use: ['Basic'] });
    nlp = dock.get('nlp');
    nlp.addLanguage('en'); // Explicitly add English language

    // Fetch intents from the 'corpus' collection
    const intents = await Intent.find();

    // Add intents to the NLP model dynamically
    intents.forEach(intent => {
      // Add each utterance as a training example for the intent
      intent.utterances.forEach(utterance => {
        nlp.addDocument('en', utterance, intent.intent);
      });

      // Add responses for the intent
      intent.responses.forEach(response => {
        nlp.addAnswer('en', intent.intent, response);
      });
    });

    // Train and save the model
    await nlp.train();
    nlp.save();
    console.log("NLP model trained and saved");

  } catch (error) {
    console.error("Error connecting to MongoDB or training model:", error);
  }
})();

// Async function to get a chat response
async function getChatResponse(message) {
  const response = await nlp.process('en', message);
  return response.answer || "Oops! I didn't get that.";
}

module.exports = { getChatResponse };
