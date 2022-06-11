const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { status } = require('express/lib/response');
//@route  Get api/profile/me
// @desc  Get current user profile
//@access Private

//monggose return a promish so we have to use async here
router.get('/me', auth, async (req, res) => {
  try {
    //populate use to bring in the user name ans avatar
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );

    if (!Profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route  Post api/profile
//@desc  Create or update user profile
//@access Private

router.post(
  '/',
  [
    auth,
    [
      check('status', 'status is required') //here status is required
        .not()
        .isEmpty(),
      check('skills', 'Skills is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    //check validation for req
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //puled out all the profile stuff from the body object
    const {
      company,
      age,
      gender,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      twitter,
      facebook,
      linkedin,
      instagram,
    } = req.body;

    //now build the profile object to chech if user filled the all field or not
    //Build ProfileFields object to insert in to the database and we need to chech to see is the stuff is actually coming in before we set it
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (age) profileFields.age = age;
    if (gender) profileFields.gender = gender;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map(skill => skill.trim());
    }
    // console.log(profileFields.skills);

    // res.send('Hello');
    //now check for Build social object
    profileFields.social = {}; //here initialize social
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id }); //by using findone method we can find our profile based on the user id

      //if profile found that we can udate this
      if (profile) {
        //Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id }, //find it by the user
          { $set: profileFields }, //set the profilefields above
          { new: true } //object new and set that true
        );
        return res.json(profile);
      }
      //if not found we can create it save it and send back to profile
      //Create
      profile = new Profile(profileFields);

      await profile.save(); //we call bulksave on the instance of the Profile models
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//@route  Get api/profile
//@desc   Get all profile
//@access Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route  Get api/profile/user/:user_id
//@desc   Get profile by user ID
//@access Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) return res.status(400).json({ msg: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      //kind return any kind of error match with any error of objectid
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server Error');
  }
});

//@route  DELETE api/profile
//@desc   Delete profile, user $ posts
//@access Private
router.delete('/', auth, async (req, res) => {
  try {
    // @todo - remove users posts

    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    //Remove user
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route  Put api/profile/experience
//@desc   Add profile experience
//@access Private
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('company', 'Company is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, company, location, from, to, current, description } =
      req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp); //unshift() method adds one or more elements to the beginning of an array and returns the new length of the array

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//@route  DELETE api/profile/experience/:exp_id
//@desc   Delete experience from profile
//@access Private

//delete experience based on the exp_id
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }); //getting the profileof logged in user

    // Get remove index
    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id); //getting the index by map function

    //splice() method is an inbuilt method in JavaScript which is used to modify the contents of an array by removing the existing elements and/or by adding new elements.
    profile.experience.splice(removeIndex, 1); // and slipeing out

    await profile.save(); // and then resave it
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route  Put api/profile/education
//@desc   Add profile education
//@access Private
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is required').not().isEmpty(),
      check('degree', 'Degree is required').not().isEmpty(),
      check('fieldofstudy', 'Fieldofstudy is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
        school, 
        degree, 
        fieldofstudy, 
        from, 
        to, 
        current, 
        description 
    } =  req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEdu); //unshift() method adds one or more elements to the beginning of an array and returns the new length of the array

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//@route  DELETE api/profile/education/:edu_id
//@desc   Delete education from profile
//@access Private

//delete education based on the edu_id
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }); //getting the profileof logged in user

    // Get remove index
    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.edu_id); //getting the index by map function

    //splice() method is an inbuilt method in JavaScript which is used to modify the contents of an array by removing the existing elements and/or by adding new elements.
    profile.education.splice(removeIndex, 1); // and slipeing out

    await profile.save(); // and then resave it
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route  Get api/profile/github/:username
//@desc   Get user repos from github
//@access Public
router.get('/github/:username', (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method: 'GET', //method for request
            Headers: {'user-agent': 'node.js'}
        };

        request(options, (error, response, body) => {
            if(error) 
            console.error(error);

            // res.json(JSON.parse(JSON.stringify(body)));

            if(response.statusCode !== 200) {
                return res.status(404).json({msg: 'No Github Profile found'});
            }

            return res.json(JSON.parse(JSON.stringify(body)));  //returnt the github user profile
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
