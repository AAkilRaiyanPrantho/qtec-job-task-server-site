const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config()

//middlewares
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Fly Taskify!!!')
})

app.listen(port, () => {
  console.log(`Taskify running on port ${port}`)
})