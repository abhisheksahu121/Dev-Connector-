const express = require('express');
// const { route } = require('express/lib/application');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

//@route  Get api/posts
// @desc  Test route
//@access Public

// router.get('/',(req, res) => res.send('Posts route'));

//@route  POST api/posts
// @desc  Create a post
//@access Private

router.post(
  '/',
  [
    auth,
    [
      //always check the text field we do have the name and avatar associated with the post as well but for this we gonna make a request using the user id
      //that we  get fronm the token to get that so not required chek
      check('text', 'Text is required').not().isEmpty(),
    ]
  ],
  async (req, res) => {
    //check for validation
    const errors = validationResult(req);
    //check for error
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    try {
      //here we have the token which gives us the user id and put inside the req.user.id so we can use that
      //and we dont want to send password back so i am gonna use select() method
      const user = await User.findById(req.user.id).select('-password'); //that will give us user

      //variable for newPost
      const newPost = new Post({
        //we instance from the Post model
        text: req.body.text, //text is come from the body
        //and rest of stuff come from the user
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      const post = await newPost.save(); //we have newPost inside that variable
      res.json(post); //we can send that as response
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//@route  Get api/posts
// @desc  Get all posts
//@access Private

router.get('/',auth, async (req, res) => {
    try {
        //using post model find and sort the data based on date and we wanted most recent so add -1 which will dive me most recent first
        const posts = await Post.find().sort({ date: -1});
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
//@route  Get api/posts/:id
//@desc  Get post by ID
//@access Private

router.get('/:id',auth, async (req, res) => {
    try {
        //find the post by its id
        const post = await Post.findById(req.params.id);
        //check if there is a post with this id
        if(!post) {
            return res.status(404).json({msg: 'Post not found'});
        }
        res.json(post);
    } catch (err) {
        console.error(err.message);
        //if the objectId is not a valid id it means is not a formated ObjectId
        //sp here if any kind of err is mathes with the not formated ObjectId then we return error msg
        if(err.kind === "ObjectId") {
            return res.status(404).json({msg: 'Post not found'});
        }
        res.status(500).send('Server Error');
    }
});
//@route  DELETE api/posts/:id
// @desc  Delete a post
//@access Private

router.delete('/:id',auth, async (req, res) => {
    try {
        //using post model find and sort the data based on date and we wanted most recent so add -1 which will dive me most recent first
        const post = await Post.findById(req.params.id);
        //check if post dose not access
        if(!post) {
            return res.status(404).json({msg: 'Post not found'});
        }
        //now we want to make sure that the user that deleting the post is the user thats own the post

        //Check user and we want to match the post user or check to see if post.user !== req.user.id(logged in user)  
        //so here req.user.id(logged in user) is a string and the post.user is not a string this is ObjectId so for 
        //match these two we have to add toString() method which will convert ObjectId to String
        if(post.user.toString() !== req.user.id){
            return res.status(401).json({msg: 'User not authorized'});
        }

        await post.remove();
        res.json({msg: 'Post remove'});
    } catch (err) {
        if(err.kind === "ObjectId") {
            return res.status(404).json({msg: 'Post not found'});
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
//this is going to be put request bcs technically we are updating the post
//@route  PUT api/posts/like/:id
// @desc  Like a post
//@access Private

router.put('/like/:id',auth, async(req,res) => {
    try {
        const post  = await Post.findById(req.params.id);

        //Check if the post has already been liked
        //so here we goona use filter method The filter() method creates a new array with all elements that pass the test implemented by the provided function.
        //and filter takes an function with the like parameter and after that we compare the current user to the user that is logged in and also like.user turn in to the string so that is actully match\
        //the user id thats in req.user.id and after that we want to check the length of that so if the length of that is grater than 0
        // it means it is already be logged in
    if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
        return res.status(400).json({msg: 'Post already liked'}); //status() function set the HTTP status for the response.
    }
    //if user has an already liked it than we want to take that post like and we wanna add on to it
    post.likes.unshift({user: req.user.id});

    await post.save();

    res.json(post.likes);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');   
    }
});

//@route  PUT api/posts/unlike/:id
//@desc  unike a post
//@access Private

router.put('/unlike/:id',auth, async(req,res) => {
    try {
        const post  = await Post.findById(req.params.id);

       // same as the above code but the difference is here we unlike the post

       //Check if the post has aleady been liked
    if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
        return res.status(400).json({msg: 'Post has not yet been liked'}); //status() function set the HTTP status for the response.
    }
    //if user has an already liked it than we want to remove that like
    //Get remove index
    const removeIndex = post.likes
    .map(like => like.user.toString())
    .indexOf(req.user.id); 

    post.likes.splice(removeIndex, 1);

    await post.save();

    res.json(post.likes);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');   
    }
});

//@route  POST api/posts/comment/:id
//@desc  Comment on a post
//@access Private

router.post(
    '/comment/:id',
    [
      auth,
      [
        //always check the text field we do have the name and avatar associated with the post as well but for this we gonna make a request using the user id
        //that we  get fronm the token to get that so not required chek
        check('text', 'Text is required').not().isEmpty(),
      ]
    ],
    async (req, res) => {
      //check for validation
      const errors = validationResult(req);
      //check for error
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
      }
  
      try {
        //here we have the token which gives us the user id and put inside the req.user.id so we can use that
        //and we dont want to send password back so i am gonna use select() method
        const user = await User.findById(req.user.id).select('-password'); //that will give us user
        const post = await Post.findById(req.params.id);
        //variable for newPost
        const newComment = {
          //we instance from the Post model
          text: req.body.text, //text is come from the body
          //and rest of stuff come from the user
          name: user.name,
          avatar: user.avatar,
          user: req.user.id,
        };
    
        //now we have to add this new comment to the post comment which we can access with post.comments and 
        //we gonna use unshift() to added to bigening and then we passes our new comment and than we can save it
        post.comments.unshift(newComment);

        post.save(); //call the post 
        res.json(post.comments); //we can send all the comments as response
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
  );

//@route  DELETE api/posts/comment/:id/:comment_id
//@desc  Delete comment
//@access Private
router.delete('/comment/:id/:comment_id', auth, async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        //Pull out Comment
        //use find method that will take function as an input parameter and also for each comment we want to test and see if each comment.id === req.params.comment_id
        //so now this will give us comment if it exist either false
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);

        //make sure commet exists
        if(!comment) {
            return res.status(404).json({msg: 'Comment does not exist'})
        }

        //afetr that we want to make sure that the user that deleting the comment is the user that actually made the comment
        if(comment.user.toString() !== req.user.id)
        {
            return res.status(401).json({msg: 'user not authorized'});
        }
        //Get remove index
    const removeIndex = post.comments
    .map(comment => comment.user.toString())
    .indexOf(req.user.id); 

    post.comments.splice(removeIndex, 1);

    await post.save();

    res.json(post.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})
module.exports = router;
