const express = require('express');
const Router = express.Router();

// @Route   GET api/posts
// @desc    Test route
// @access  Public
Router.get('/', (req,res) => res.send('Posts route'));


module.exports = Router;
