require('dotenv').config({ path: './IntentManager/backend/.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const intentsRouter = require('./routes/intents');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/nlp_corpus")
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/intents', intentsRouter);

const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));