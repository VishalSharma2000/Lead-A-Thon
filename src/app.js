require('dotenv').config();
const express = require('express');
const morgan = require('morgan');

const app = express();

const PORT = 5000;

app.use(morgan('dev'));
app.use(express.json());

const gameRoutes = require('../src/routes/gameRoute');

app.use(gameRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on PORT - ${PORT}`);
})