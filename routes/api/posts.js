const express = require('express');
const Router = express.Router();
const User = require('../../models/User');
const Posts = require('../../models/Posts');
const { check, validationResult } = require('express-validator');
const checkObjectId = require('../../middleware/checkObjectId');
const auth = require('../../middleware/auth');

// @Route   POST api/posts
// @desc    Create a post
// @access  Private
Router.post(
  '/',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
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
        user: req.user.id,
      });

      const post = await newPost.save();
      res.json(post);
    } catch (e) {
      console.error(e.message);
      res.status(500).send('Server Error');
    }
  }
);

// @Route   GET api/posts
// @desc    Get all post
// @access  Private
Router.get('/', auth, async (req, res) => {
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
Router.get('/:id', [auth, checkObjectId('id')], async (req, res) => {
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
});

// @Route   DELETE api/posts/:id
// @desc    Delete a post
// @access  Private
Router.delete('/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    // Check if there is no such post
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    // Check if user owns the post
    // toString() was used because post.user in an ObjectId, not a string
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
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

// @Route   PUT api/posts/like/:id
// @desc    Like a post
// @access  Private
Router.put('/like/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    // Check if post has already been liked by the current logged in user
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    post.likes.unshift({ user: req.user.id });
    await post.save();
    return res.json(post.likes);
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server Error');
  }
});

// @Route   PUT api/posts/unlike/:id
// @desc    Unlike a post
// @access  Private
Router.put('/unlike/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    // Check if post has already been liked by the current logged in user
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }

    // Get remove index
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);
    await post.save();
    return res.json(post.likes);
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server Error');
  }
});

// @Route   POST api/posts/comment/:id
// @desc    Comment on a post
// @access  Private
Router.post(
  '/comment/:id',
  [
    auth,
    checkObjectId('id'),
    [check('text', 'Text is required').not().isEmpty()],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Posts.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      post.comments.unshift(newComment);

      await post.save();
      return res.json(post.comments);
    } catch (e) {
      console.error(e.message);
      res.status(500).send('Server Error');
    }
  }
);

// @Route   DELETE api/posts/comment/:post_id/:comment_id
// @desc    Delete a comment for a post
// @access  Private
Router.delete('/comment/:post_id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Posts.findById(req.params.post_id);
    // Pull out comment from post
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    // Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }
    // If comment is found, make sure user deleting the comment owns the comment
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    post.comments = post.comments.filter(
      ({ post_id }) => post_id !== req.params.comment_id
    );

    return res.json(post.comments);
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server Error');
  }
});

module.exports = Router;
