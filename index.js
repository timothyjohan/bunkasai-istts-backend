const express = require('express');
const cors = require('cors');
const tenants = require('./routes/tenants');
const jsong = require('./routes/jsong');
const mongoose = require('mongoose');


const app = express();
const port = 3666;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/tenants', tenants);
app.use('/api/jsong', jsong);

app.get('/', (req, res) => {
  res.send('GET request to the homepage')
})

// Start the server
app.listen(port, async ()  => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/db_bunkasai_istts')
    console.log('hehehhehee');
  } catch (error) {
    console.log(error);
  }
  console.log(`Server is running on port ${port}`);
});
