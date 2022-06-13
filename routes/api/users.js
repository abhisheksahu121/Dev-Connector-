const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator'); //validation for name ,email and password

const User = require('../../models/User') //import the user module
//this get request api is just for test now we work on the post request api
//@route  Get api/users
//@desc   Test route
//@access Public

// router.get('/',(req, res) => res.send('User route'));

//@route  Post api/users
//@desc   Register user
//@access Public

router.post(
  '/',
  [
    check('name', 'name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
 async (req, res) => {
    //so by using post we can send whatever data we want to send to req.body and access it

    // console.log(req.body); // this is the object of data thats going to be send to routes. and for work for req.body we have to
                            //initialize middleware for the body parsser

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });                        
  }

  const {name, email, password } = req.body;  // pulled out name email password from req.body


  // User.findOne().then()  - this findone() method return the promish so isted of this we can use async await method

try {

//see if user exists
let user = await User.findOne({email}); //find user based on email

if(user) {
 return res.status(400).json({errors: [{msg: 'User already exist'}]});
}

//Get users gravatar - this is very easy to use we basically just need to pass the useremail in to the method and that will give us the url of the gravatar
 const avatar = gravatar.url(email,{
   s: '200',
   r: 'pg',
   d: 'mm'
 })

 user = new User({  //so this will only create new user so we have to call user.save inorder to save this in database
   name,
   email,
   avatar,
   password
 });
//Encrypt password - encrypt password using bcrypt
const salt = await bcrypt.genSalt(10);   // bcrypt.genSalt was generate Salt for my password which need to encrypted

user.password = await bcrypt.hash(password, salt);

//anything which return promish we need to put 'await' there
await user.save();

//Return jsonwebtoken - so the resion to retrun the jsonwebtoken bcs in the frontend when the user resgistered i want them to loged in right away and 
// inorder to be logged in you have tab that token

// res.send('User route');
const payload = {
  user: {
    id: user.id
  }
};

jwt.sign(
  payload,
  config.get('jwtSecret'),
  {expiresIn: 36000},
  (err, token) => {
    if(err) throw err;
    res.json({token});
  }
);
} catch(err) {
  console.error(err.message);
  res.status(500).send('Server error')
}

}
);

module.exports = router;
