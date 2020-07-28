const express = require('express');
const Router = express.Router();
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

// @Route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
Router.get('/me', auth, async (req,res) => {
  try {
    // req.user is used here because it can be accessed anywhere auth is used
    // .populate references the 'name' and 'avatar' in the 'users' collection
    // 'User' has a capital u because that was how i named the model, but when populating,
    // it becomes 'user'
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name, avatar']);
    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' })
    }
    res.json(profile);
  } catch (e) {
    console.log(e.message);
    res.status(500).send('Server error')
  }
});


// @Route   POST api/profile
// @desc    Create or Update user profile
// @access  Private

// In order to use more than one middleware, you must put them in an array
Router.post('/', [auth, [
  // 'status' refers to the field to be checked
  check('status', 'Status is required').not().isEmpty(),
  check('skills', 'Skills is required').not().isEmpty()
]], async (req,res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const {
    company,
    website,
    location,
    bio,
    status,
    githubusername,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin
  } = req.body

  // Build profile fields
  const profileFields = {};
  profileFields.user = req.user.id;
  if(company) profileFields.company = company;
  if(website) profileFields.website = website;
  if(location) profileFields.location = location;
  if(bio) profileFields.bio = bio;
  if(status) profileFields.status = status;
  if(githubusername) profileFields.githubusername = githubusername;
  if(skills) {
    // skills would now be turned into an array because currently it is a string
    // the .split(', ') method turns a string into an array, and this case the
    // delimiter is a comma
    // It is turned into an array because in the Profile Schema, the type was defined
    // type: [String], so it must be converted into an array
    // .trim() was used to remove all spaces around a skill
    profileFields.skills = skills.split(',').map(skill => skill.trim());
    // console.log(profileFields);
  }

  // Build social object
  profileFields.social = {};
  if(youtube) profileFields.social.youtube = youtube;
  if(facebook) profileFields.social.facebook = facebook;
  if(twitter) profileFields.social.twitter = twitter;
  if(instagram) profileFields.social.instagram = instagram;
  if(linkedin) profileFields.social.linkedin = linkedin;

  try {
    let profile = await Profile.findOne({ user: req.user.id });
    if (profile) {
      // Update
      profile = await Profile.findOneAndUpdate({ user: req.user.id }, {
        $set: profileFields
      }, { new: true });

      return res.json(profile);
    } else {
      // Create
      profile = new Profile(profileFields);
      await profile.save();
      return res.json(profile);
    }

  } catch (e) {
    console.log(e.message);
    res.status(500).send('Server Error');
  }

})



// @Route   GET api/profile
// @desc    Get all profiles
// @access  Public
Router.get('/', async (req,res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server Error');
  }
})


// @Route   GET api/profile/user/:user._id
// @desc    Get profile by user id
// @access  Public
Router.get('/user/:user_id', async (req,res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);
    if (!profile) {
      return res.status(400).json({ msg: 'Profile not found' })
    }
      res.json(profile);

  } catch (e) {
    console.error(e.message);
    if (e.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' })
    }
    res.status(500).send('Server Error');
  }
})


// @Route   DELETE api/profile/
// @desc    Delete profile, user, and posts
// @access  Private
Router.delete('/', auth, async (req,res) => {
  try {
    // @todo - remove users posts

    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // Remove User
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'User deleted' });

  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server Error');
  }
})


// @Route   PUT api/profile/experience
// @desc    Add profile experience
// @access  Private
Router.put('/experience', [auth, [
  check('title', 'Title is required').not().isEmpty(),
  check('company', 'Company is required').not().isEmpty(),
  check('from', 'From date is required').not().isEmpty()
]], async (req,res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { title, company, location, from, to, current, description } = req.body;
  const newExp = {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  }

  try {
    const profile = await Profile.findOne({ user: req.user.id });
    profile.experience.unshift(newExp);
    await profile.save();
    return res.json(profile);
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server Error');
  }

})



// @Route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
Router.delete('/experience/:exp_id', auth, async (req,res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    // Get remove index
    const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
    // The splice method removes 1 item with the specified index, which in this case,
    // is the index of each experience id, that matches the params
    profile.experience.splice(removeIndex, 1);
    await profile.save();
    return res.json(profile);
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server Error');
  }
})




// @Route   PUT api/profile/education
// @desc    Add profile education
// @access  Private
Router.put('/education', [auth, [
  check('school', 'School is required').not().isEmpty(),
  check('degree', 'Degree is required').not().isEmpty(),
  check('fieldofstudy', 'Field of study is required').not().isEmpty(),
  check('from', 'From date is required').not().isEmpty()
]], async (req,res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { school, degree, fieldofstudy, from, to, current, description } = req.body;
  const newEdu = {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  }

  try {
    const profile = await Profile.findOne({ user: req.user.id });
    profile.education.unshift(newEdu);
    await profile.save();
    return res.json(profile);
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server Error');
  }

})



// @Route   DELETE api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private
Router.delete('/education/:exp_id', auth, async (req,res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    // Get remove index
    const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
    // The splice method removes 1 item with the specified index, which in this case,
    // is the index of each education id, that matches the params
    profile.education.splice(removeIndex, 1);
    await profile.save();
    return res.json(profile);
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server Error');
  }
})





module.exports = Router;
