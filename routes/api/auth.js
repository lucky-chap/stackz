const express = require('express');
const Router = express.Router();
const User = require('../../models/User');
const auth = require('../../middleware/auth');

// @Route   GET api/auth
// @desc    Test route
// @access  Public
Router.get('/', auth, async (req,res) => {
  try {
    // req.user refers to the decoded user in the auth.js middleware
    // Doing .select('-password') will leave off the password in the data
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (e) {
    console.log(e.message);
    res.status(500).send('Server Error');
  }
});


module.exports = Router;
