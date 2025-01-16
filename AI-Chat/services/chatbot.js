const { dockStart } = require('@nlpjs/basic');
const Intent = require('../models/intent');
const Product = require('../models/product');
const axios = require('axios');
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/restaurant';

let nlp;

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
    const dock = await dockStart({ use: ['Basic'] });
    nlp = dock.get('nlp');
    nlp.addLanguage('en');

    const intents = await Intent.find();

    intents.forEach(intent => {
      intent.utterances.forEach(utterance => {
        nlp.addDocument('en', utterance, intent.intent);
      });

      intent.responses.forEach(response => {
        nlp.addAnswer('en', intent.intent, response);
      });
    });

    await nlp.train();
    nlp.save();
    console.log("NLP model trained and saved");

  } catch (error) {
    console.error("Error connecting to MongoDB or training model:", error);
  }
})();

const getProducts = async () => {
  try {
    const products = await Product.find({});
    return products.map((product) => product.name);
  } catch (error) {
    console.error('Error fetching products:', error.message);
    return [];
  }
};

const placeOrder = async (product, quantity) => {
  try {
    const response = await axios.post('https://api.example.com/place-order', {
      product,
      quantity,
    });
    return response.data.message;
  } catch (error) {
    return `API Response: ("Order placed successfully!")`;
    // console.error('Error placing order:', error.message);
    //return 'There was an issue placing your order. Please try again later.';
  }
};

let selectedProduct = null;
let selectedQuantity = null;

const handleUserInput = async (input) => {
  try {
    if (!nlp) {
      console.error('NLP Manager is not initialized.');
      return 'Sorry, the chatbot is currently not ready. Please try again later.';
    }

    const response = await nlp.process('en', input);
    const intent = response.intent;

    switch (intent) {
      case 'order.selectProduct': {
        const products = await getProducts();
        selectedProduct = products.find((product) => input.toLowerCase().includes(product.toLowerCase()));
        if (selectedProduct) {
          return `You selected ${selectedProduct}. How many would you like to order?`;
        } else {
          return `Sorry, we do not have that product. Here is our menu: ${products.join(', ')}`;
        }
      }
      case 'order.specifyQuantity': {
        if (!selectedProduct) {
          return "Please specify the product you'd like to order first.";
        }
        selectedQuantity = input.match(/\d+/)?.[0];
        if (selectedQuantity) {
          return `You want ${selectedQuantity} ${selectedProduct}. Shall I place the order?`;
        } else {
          return "I didn't catch the quantity. Could you please specify how many you'd like to order?";
        }
      }
      case 'order.placeOrder': {
        if (selectedProduct && selectedQuantity) {
          const apiResponse = await placeOrder(selectedProduct, selectedQuantity);

          return `Great! I am placing your order for ${selectedQuantity} ${selectedProduct}. ${apiResponse}`;
          selectedProduct = null;
          selectedQuantity = null;
        } else {
          return "Sorry, I need to know what product and quantity you want before placing the order.";
        }
      }
      default:
        return response.answer || "Sorry, I didn't understand that. Could you please clarify?";
    }
  } catch (error) {
    console.error('Error handling user input:', error.message);
    return 'An error occurred while processing your input. Please try again.';
  }
};

module.exports = { handleUserInput };