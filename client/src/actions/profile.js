//we are gone to making request so bring in axios
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import {setAlert} from './alert';

import {
    ACCOUNT_DELETED,
    CLEAR_PROFILE,
    GET_PROFILE,
    GET_PROFILES,
    PROFILE_ERROR,
    UPDATE_PROFILE,
    GET_REPOS
    // ACCOUNT_DELETED
} from './types';

//Get current user profile
export const getCurrentProfile = () => async dispatch => {
   
    try {
        const res = await axios.get('/api/profile/me'); //we dont have to pass in any id or anything bcs its gonna know which profile is load from the token we send which has the user id

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};
// Get all profiles
export const getProfiles = () => async dispatch => {
     //so one think i want to do that when user go to the profile list page i want to clear whatever in the current profile bcs when we visit single user profile its gonna go into the stage
     dispatch({type: CLEAR_PROFILE});
    try {
        const res = await axios.get('/api/profile');

        dispatch({
            type: GET_PROFILES,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};
// Get profile by ID
export const getProfileById = userId => async dispatch => {
     //so one think i want to do that when user go to the profile list page i want to clear whatever in the current profile bcs when we visit single user profile its gonna go into the stage
     dispatch({type: CLEAR_PROFILE});
    try {
        const res = await axios.get(`/api/profile/user/${userId}`);

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};
// Get Github repos
export const getGithubRepos = username => async dispatch => {
     //so one think i want to do that when user go to the profile list page i want to clear whatever in the current profile bcs when we visit single user profile its gonna go into the stage
     dispatch({type: CLEAR_PROFILE});
    try {
        const res = await axios.get(`/api/profile/github/${username}`);

        dispatch({
            type: GET_REPOS,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};

// Create or update profile

//now we passed couple of parameter here - and another thing we can do is that redirect after submit the form so for this we pass the   object which has the method called push that will redirect us to client side route.
//and then inorder to know the updating, editing or creating a new profile i am gonna have the parameter 'edit=false'
// pass the history object that have a push medthod which will redirect us to any page which we were passing into push method
export const createProfile = (formData, edit=false) => async dispatch => {
    try {
        //since we are sending data we need to create config object
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        //so now we want to make a request or making a post request to api/profile so we also update the profile
        const res = await axios.post('/api/profile', formData, config);

        dispatch({
            type: GET_PROFILE,
            payload: res.data  //actuall profile
        });

        dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Creater', 'succes'));

        //what we can do next that is we edditing it i am not gonna redirect it i stay on the page and if were creating it  then i wanna redirect 
        if(!edit) {
            // pass the history object that have a push medthod which will redirect us to any page which we were passing into push method
            // history.push('/dashboard');
            Redirect('/dashboard');
        }
    } catch (err) {
        console.log(err.message)
        // const errors = err.response.data.errors;
        // if (errors) {
        //   //for each error dispatch alert
        //   errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        // }

        // dispatch({
        //     type: PROFILE_ERROR,
        //     payload: {msg: err.response.statusText, status: err.response.status}
        // });
    }
};

//Add Experience
//use history method to redirect back to the dashboard 
export const addExperience = (formData) => async dispatch => {
    try {
        //since we are sending data we need to create config object
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        //so now we want to make a request or making a post request to api/profile so we also update the profile
        const res = await axios.put('/api/profile/experience', formData, config);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data  //actuall profile
        });

        dispatch(setAlert('Experience Added', 'succes'));

        //what we can do next that is we edditing it i am not gonna redirect it i stay on the page and if were creating it  then i wanna redirect 
            // history.push('/dashboard');
            Redirect('/dashboard');
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
          //for each error dispatch alert
          errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
} 
//Add Education
//use history method to redirect back to the dashboard 
export const addEducation = (formData) => async dispatch => {
    try {
        //since we are sending data we need to create config object
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        //so now we want to make a request or making a post request to api/profile so we also update the profile
        const res = await axios.put('/api/profile/education', formData, config);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data  //actuall profile
        });

        dispatch(setAlert('Education Added', 'succes'));

        //what we can do next that is we edditing it i am not gonna redirect it i stay on the page and if were creating it  then i wanna redirect 
            // history('/dashboard');
            Redirect('/dashboard');
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
          //for each error dispatch alert
          errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};

//Delete experience
export const deleteExperience = id => async dispatch => {
    try {
        const res = await axios.delete(`/api/profile/experience/${id}`);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data  //actuall profile
        });
       

        dispatch(setAlert('Experience Removed', 'succes'));
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};

//Delete education
export const deleteEducation = id => async dispatch => {
    try {
        const res = await axios.delete(`/api/profile/education/${id}`);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data  //actuall profile
        });
       

        dispatch(setAlert('Education Removed', 'succes'));
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};

//Delete Account & profile
export const deleteAccount = id => async dispatch => {
    if(window.confirm('Are you sure? This can NOT be undone!'))
    {
    try {
        const res = await axios.delete('/api/profile');

        dispatch({
            type: CLEAR_PROFILE,
        });
        dispatch({
            type: ACCOUNT_DELETED,
        });
       

        dispatch(setAlert('Your account has been permanantly deleted'));
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
   }
};