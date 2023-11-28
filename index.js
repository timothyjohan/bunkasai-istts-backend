const express = require('express');
const cors = require('cors');
const tenants = require('./routes/tenants');
const jsong = require('./routes/jsong');
const coswalk = require('./routes/coswalk');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config().parsed;



const app = express();
const port = 3666;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/tenants', tenants);
app.use('/api/jsong', jsong);
app.use('/api/coswalk', coswalk);

app.get('/', (req, res) => {
  res.send('GET request to the homepage')
})

// Start the server
app.listen(dotenv.PORT, async ()  => {
  try {
    await mongoose.connect(`mongodb+srv://${dotenv.USERNAME}:${dotenv.PASSWORD}@cluster0.klxoze2.mongodb.net/${dotenv.DB_NAME}`)
    console.log('hehehhehee');
  } catch (error) {
    console.log(error);
  }
  console.log(`Server is running on port ${dotenv.PORT}`);
  console.log(dotenv);
});
