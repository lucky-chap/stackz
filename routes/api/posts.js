const express = require('express');
const Router = express.Router();
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Posts = require('../../models/Posts');
const { check, validationResult } = require('express-validator');
const auth =  require('../../middleware/auth');

// @Route   POST api/posts
// @desc    Create a post
// @access  Public
Router.post('/', [auth, [
  check('text', 'Text is required').not().isEmpty()
]], async (req,res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findById(req.user.id).select('-password');

    const newPost = new Posts({
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id
    });

    const post = await newPost.save();
    res.json(post);

  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server Error');
  }


});


module.exports = Router;
