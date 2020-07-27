const express = require('express');
const Router = express.Router();

// @Route   GET api/auth
// @desc    Test route
// @access  Public
Router.get('/', (req,res) => res.send('Auth route'));


module.exports = Router;
