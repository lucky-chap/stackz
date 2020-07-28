const express = require('express');
const { check, validationResult } = require('express-validator')
const config = require('config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Router = express.Router();
const User = require('../../models/User');
const auth = require('../../middleware/auth');

// @Route   GET api/auth
// @desc    Test route
// @access  Private
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


// @Route   POST api/users
// @desc    Authenticate user and get token
// @access  Public
Router.post('/', [
  check('email', 'Please include valid email').isEmail(),
  check('password', 'Please enter valid password').exists()
], async (req,res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { email, password } = req.body;
  try {
    // See if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: [ { msg: 'Invalid credentials' } ] })
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ errors: [ { msg: 'Invalid credentials' } ] })
    }

    // Return jsonwebtoken
    const payload = {
      user: {
        id: user.id
      }
    }

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: 360000 },
      (err,token) => {
        if (err) throw err;
        res.json({ token })
      }
    );
  } catch (e) {
    console.log(e.message);
    res.status(500).send('Server Error...')
  }


});


module.exports = Router;
