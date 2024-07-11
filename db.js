const mongoose = require('mongoose');

require('dotenv').config();
const mongoUrl = process.env.DB_URL;
mongoose.connect(mongoUrl, {
    useNewUrlParser: true,

    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('connected', () => {
    console.log('online connected');
});
db.on('disconnected', () => {
    console.log('disconnected');
});
db.on('error', (err) => {
    console.error('connection error:', err);
});

module.exports = db;
