const express = require('express');
const connectDB = require('./config/db');
const app = express();
// Connect database
connectDB();

app.get('/', (req,res) => res.send('Api Running'));



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('App running on PORT: '+ PORT));
