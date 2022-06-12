const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');

//@route  Get api/auth
//@desc  Test route
//@access Public

//so whenever we use middleware we simply add auth as a second parameter
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route  Post api/auth
//@desc   Authenticate user & get token
//@access Public

router.post(
  '/',
  [
    //   check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    //so by using post we can send whatever data we want to send to req.body and access it

    // console.log(req.body); // this is the object of data thats going to be send to routes. and for work for req.body we have to
    //initialize middleware for the body parsser

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body; // pulled out name email password from req.body

    // User.findOne().then()  - this findone() method return the promish so isted of this we can use async await method

    try {
      //see if user exists
      let user = await User.findOne({ email }); //find user based on email

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msa: 'Invalid Credentials' }] });
      }

      //Return jsonwebtoken - so the resion to retrun the jsonwebtoken bcs in the frontend when the user resgistered i want them to loged in right away and
      // inorder to be logged in you have tab that token

      // res.send('User route');

      const isMatch = await bcrypt.compare(password, user.password); //match the user password

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credential' }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
