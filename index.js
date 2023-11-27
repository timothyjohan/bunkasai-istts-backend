const express = require('express');
const cors = require('cors');
const users = require('./routes/users');

const app = express();
const port = 3666;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api', users);

app.get('/', (req, res) => {
  res.send('GET request to the homepage')
})

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
