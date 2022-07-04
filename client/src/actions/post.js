import axios from 'axios';
import {setAlert} from './alert';
import {DELETE_POST, GET_POSTS,POST_ERROR, UPDATE_LIKES,ADD_POST,GET_POST,ADD_COMMENT,REMOVE_COMMENT} from './types';

//Get posts
export const getPosts = () => async dispatch => {
    try {
    const res = await axios.get('/api/posts');

    dispatch({
        type: GET_POSTS,
        payload: res.data
    });
    } catch (err) {
       dispatch({
        type: POST_ERROR,
        payload:  {msg: err.response.statusText, status: err.response.status}
       }); 
    }
};

//Add like
//Now we need to know which post are adding a like too so we are going to pass an id
export const addLike = (postId) => async dispatch => {
    try {
        //return is the array of likes
    const res = await axios.put(`/api/posts/like/${postId}`);
    //we make our request and then we get response back we want to dispatch UPDATE_LIKES and we are going to send along 
    //response with as a object bcs it contain not only the data but also the  postId 
    dispatch({
        type: UPDATE_LIKES,
        payload: {postId, likes: res.data}
    });
    } catch (err) {
       dispatch({
        type: POST_ERROR,
        payload:  {msg: err.response.statusText, status: err.response.status}
       }); 
    }
};

//Remove like
//Now we need to know which post are adding a unlike too so we are going to pass an id
export const removeLike = (postId) => async dispatch => {
    try {
        //return is the array of unlikes
    const res = await axios.put(`/api/posts/unlike/${postId}`);
    //we make our request and then we get response back we want to dispatch UPDATE_LIKES and we are going to send along 
    //response with as a object bcs it contain not only the data but also the  postId 
    dispatch({
        type: UPDATE_LIKES,
        payload: {postId, likes: res.data}
    });
    } catch (err) {
       dispatch({
        type: POST_ERROR,
        payload:  {msg: err.response.statusText, status: err.response.status}
       }); 
    }
};
//Delete post
//Now we need to know which post are deleting too so we are going to pass an id
export const deletePost = (postId) => async dispatch => {
    try {
    await axios.delete(`/api/posts/${postId}`);
   //just send the id so that in reducer we know how to filter out the post that got deleted from the UI
    dispatch({
        type: DELETE_POST,
        payload: postId
        // payload: res.data.postId
    });

    dispatch(setAlert('Post Removed', 'success'));
    } catch (err) {
       dispatch({
        type: POST_ERROR,
        payload:  {msg: err.response.statusText, status: err.response.status}
       }); 
    }
};
//Add post

export const addPost = formData => async dispatch => {
    //since we are sending data we need to define config with headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    try {
    const res = await axios.post('/api/posts/',formData,config);
   //just send the id so that in reducer we know how to filter out the post that got deleted from the UI
    dispatch({
        type: ADD_POST,
        // payload: postId
        payload: res.data
    });

    dispatch(setAlert('Post Created', 'success'));
    } catch (err) {
       dispatch({
        type: POST_ERROR,
        payload:  {msg: err.response.statusText, status: err.response.status}
       }); 
    }
};

//Get post
export const getPost = (id) => async dispatch => {
    try {
    const res = await axios.get(`/api/posts/${id}`);

    dispatch({
        type: GET_POST,
        payload: res.data
    });
    } catch (err) {
       dispatch({
        type: POST_ERROR,
        payload:  {msg: err.response.statusText, status: err.response.status}
       }); 
    }
};

//Add comment

export const addComment = (postId,formData) => async dispatch => {
    //since we are sending data we need to define config with headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    try {
    const res = await axios.post(`/api/posts/comment/${postId}`,formData,config);
   //just send the id so that in reducer we know how to filter out the post that got deleted from the UI
    dispatch({
        type: ADD_COMMENT,
        // payload: postId
        payload: res.data
    });

    dispatch(setAlert('Comment Added', 'success'));
    } catch (err) {
       dispatch({
        type: POST_ERROR,
        payload:  {msg: err.response.statusText, status: err.response.status}
       }); 
    }
};

//Delete comment

export const deleteComment = (postId,commentId) => async dispatch => {
    try {
    await axios.delete(`/api/posts/comment/${postId}/${commentId}`);
   //just send the id so that in reducer we know how to filter out the post that got deleted from the UI
    dispatch({
        type: REMOVE_COMMENT,
        // payload: postId
        payload: commentId //so we know which one to delete/remove in the state
    });

    dispatch(setAlert('Comment Removed', 'success'));
    } catch (err) {
       dispatch({
        type: POST_ERROR,
        payload:  {msg: err.response.statusText, status: err.response.status}
       }); 
    }
};