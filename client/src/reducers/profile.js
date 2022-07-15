//here we make request form the backend and send that data through the state such as the dashboard
//and as far as the reducers goes we gonna have action to get the profile,ceated updated and clear it from the state

import {
  GET_PROFILE,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  UPDATE_PROFILE,
  GET_PROFILES,
  GET_REPOS,
  SKILL_DATA
} from "../actions/types";

const initialState = {
  profile: null, //so when we make a request all our data put in there and if we want to see another user profile it will also put that in
  profiles: [], //empty array to begin with and show the list of all profile
  repos: [], //we need to fetch repos
  skill: [],
  loading: true, //true bydefault once we make a request set it to false
  error: {} //error object for any error in the object
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PROFILE:
    case UPDATE_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false
      };
    case GET_PROFILES:
      return {
        ...state,
        profiles: payload,
        loading: false
      };
    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        repos: [],
        loading: false
      };
    case GET_REPOS:
        return{
        ...state,
        repos: payload,
        loading: false,
        };
    case SKILL_DATA: 
        return {
          ...state,
          skill: payload,
          loading: false
        }
    default:
      return state;
  }
}
