const express = require('express');
const Router = express.Router();

// @Route   GET api/users
// @desc    Test route
// @access  Public
Router.get('/', (req,res) => res.send('User route'));


module.exports = Router;
