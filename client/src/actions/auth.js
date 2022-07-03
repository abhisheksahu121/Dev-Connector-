import axios from "axios";
import { setAlert } from "./alert"; //we can call that from anywhere
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE
} from "./types";
import setAuthToken from "../utils/setAuthToken";

//Load User
export const loadUser = 
  () =>
  async (dispatch) => {
    // console.log(localStorage.token)
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    

    try {
      const res = await axios.get("/api/auth");
      // console.log(res);
      dispatch({
        type: USER_LOADED,
        payload: res.data,
      });
    } catch (err) {
      // console.log(err);
      dispatch({
        type: AUTH_ERROR,
      });
    }
  };
//Register User (this is an object that content name email and password)
export const register =
  ({ name, email, password }) =>
  async (dispatch) => {
    //here we are sendin our data
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const body = JSON.stringify({ name, email, password }); //preparing data to be send
    // console.log("hello");
    try {
      const res = await axios.post('/api/users', body, config); //creat variable res for response and await axios.post() for makin post request that will get the response
     
      dispatch({
        type: REGISTER_SUCCESS,
        //payload is gonna be a data that gonna be a token bcs got token for res.
        payload: res.data,
      });
      dispatch(loadUser());
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        //for each error dispatch alert
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      }
      dispatch({
        type: REGISTER_FAIL
        //so if we het an error like the name or email not formated we are going to get an array of error
        //and we show an alert for each error so fro this i apply loop through the error
      });
    }
  };

//Login User
export const login = (email, password) => async (dispatch) => {
  //here we are sendin our data
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ email, password }); //preparing data to be send

  try {
    const res = await axios.post("/api/auth", body, config); //creat variable res for response and await axios.post() for makin post request that will get the response

    dispatch({
      type: LOGIN_SUCCESS,
      //payload is gonna be a data that gonna be a token bcs got token for res.
      payload: res.data,
    });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      //for each error dispatch alert
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: LOGIN_FAIL,
      //so if we het an error like the name or email not formated we are going to get an array of error
      //and we show an alert for each error so fro this i apply loop through the error
    });
  }
};

//Logout / Clear Profile
export const logout = () => dispatch => {

    dispatch({type: CLEAR_PROFILE});
    dispatch({type: LOGOUT});
};
