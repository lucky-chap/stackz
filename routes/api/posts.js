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


// @Route   GET api/posts
// @desc    Get all post
// @access  Private
Router.get('/', auth, async (req,res) => {
  try {
    const posts = await Posts.find().sort({ date: -1 });
    return res.json(posts);
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server Error');
  }
});


// @Route   GET api/posts/:id
// @desc    Get post by id
// @access  Private
Router.get('/:id', auth, async (req,res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    return res.json(post);
  } catch (e) {
    console.error(e.message);
    if (e.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
})



// @Route   DELETE api/posts/:id
// @desc    Delete a post
// @access  Private
Router.delete('/:id', auth, async (req,res) => {
  try {
    const post = await Posts.findById(req.params.id);
    // Check if there is no such post
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    // Check if user owns the post
    // toString() was used because post.user in an ObjectId, not a string
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' })
    }

    await post.remove();
    return res.json({ msg: 'Post removed' });

  } catch (e) {
    console.error(e.message);
    if (e.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});


module.exports = Router;
