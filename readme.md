## Phase 1 Simple AI Chatbot

### Node.js Initialization

npm init -y

### NLP Chatbot using nlp.js

#### Installing Neccessary Packages
npm install express @nlpjs/basic cors

#### Creating a new file called nlp.js
- Trains and saves the model with basic intents and replies
- exports a function that takes a message and uses the model to return a response

#### app.js
- Creates an express server
- uses the exported function from nlp.js to handle incoming messages

#### public
##### index.html
- A simple HTML page that sends a message to the server when the user clicks the send button
##### style.css
- A simple CSS file that styles the HTML page

## Phase 2 Integrating MongoDB to store and manage intents
### Backend
- npm install express mongoose dotenv @nlpjs/core cors
- Creating schema for intents
- Estabishing routes to interact with the database
- app.js to connect and handle CRUD operations on the database
### Frontend
- npx create-react-app .
- npm install axios
- react app to manage the intents
- components to display and edit the intents
- style.css to style the components
- to start the app, run npm start in frontend directory

