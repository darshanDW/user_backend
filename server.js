const express = require('express');
const app = express();
const db = require('./db');
require('dotenv').config();

const cors = require('cors');
app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
app.use('/User', userRoutes);
app.use('/Post', postRoutes);
app.listen(PORT, () => {
    console.log(PORT);
})