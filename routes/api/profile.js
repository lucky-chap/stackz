const express = require('express');
const Router = express.Router();
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const auth = require('../../middleware/auth');

// @Route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
Router.get('/me', auth, async (req,res) => {
  try {
    // req.user is used here because it can be accessed anywhere
    // .populate references the 'name' and 'avatar' in the 'users' collection
    // 'User' has a capital u because that was how i named the model, but when querying,
    // it becomes 'users'
    const profile = await Profile.findOne({ user: req.user.id }).populate('User', ['name, avatar']);
    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' })
    }
    res.json(profile);
  } catch (e) {
    console.log(e.message);
    res.status(500).send('Server error')
  }
});


module.exports = Router;
