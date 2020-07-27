const express = require('express');
const Router = express.Router();

// @Route   GET api/profile
// @desc    Test route
// @access  Public
Router.get('/', (req,res) => res.send('Profile route'));


module.exports = Router;
