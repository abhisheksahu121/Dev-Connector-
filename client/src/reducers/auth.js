import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT
} from "../actions/types";

//thats our state for authentication
const initialState = {
  //here we are fatching the token if its there
  token: localStorage.getItem("token"), //here we get the token from the backend and store into the localstorage
  isAuthenticated: null, //so when we make a request for register or to login we get success for successfull response we going to set isAuthenticated is true
  //but by default its null becs thats the value we are going to check for the logout or other stuff
  loading: true, //so here for example we load a user and see if user is authenticated now at this you want to make sure that the laoding is done
  //so we already made a request to backend and got a responce so for this we are going to set this true bydefault
  //and then once we make a request and get the data get the response then this set to false so we know that this benn loaded
  user: null, //so when we request to the backend to api/auth and we get the user data including the name email avatar all that stuff the will get put here
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload,
      };
    case REGISTER_SUCCESS: //if the register is success we want our token back so we want our user to get logged in right away
    case LOGIN_SUCCESS: //loginsuccess do same exact thing that the register success do  
    localStorage.setItem("token", payload.token); //use setitem to put token thats return inside our localstorage
      return {
        ...state, //the sephrade oretator thells us whatever in current state thats return it
        ...payload,
        isAuthenticated: true,
        loading: false, //bcs we gotte the responce and we loaded
      };
    case REGISTER_FAIL:
    case AUTH_ERROR: //so in autherror that same thing will do and clear the localstorage if the token is not valid
    case LOGIN_FAIL:  
    case LOGOUT:
    localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    default:
      return state;
  }
}
