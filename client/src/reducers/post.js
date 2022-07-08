// import { post } from "request";
import {
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST,
  GET_POST,
  ADD_COMMENT,
  REMOVE_COMMENT
} from "../actions/types";

const initialState = {
  posts: [],
  post: null,
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_POSTS:
      return {
        ...state,
        posts: payload, //which will come from the action file
        loading: false,
      };
    case GET_POST:
      return {
        ...state,
        post: payload,
        loading: false,
      };
    case ADD_POST:
      return {
        ...state,
        //...state.posts which will make a copy of posts and then we add new post which is in the payload
        //and we pass payload at the first bcs we want latest post infront within the UI
        posts: [payload, ...state.posts],
        loading: false,
      };
    case DELETE_POST:
      return {
        ...state,
        //here we just returning the all post except for the one that matches here bcs that the one we got deleted and
        //we want manually removed that from UI
        posts: state.posts.filter((post) => post._id !== payload),
        loading: false,
      };
    case POST_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case UPDATE_LIKES:
      return {
        ...state,
        //now we want to manipulate the posts bcs this is the list of the posts page and we gonna map through the post and
        //we say that the each post we want to go ahead and say if the post.id === payload.postId bcs we want to make sure that is that correct post that were adding and removing the like too
        //and then if its match then return indivisual ...post state bcs we want to manupilate the likes so for the likes update that with the payload.likes bcs we set the object with the both likes and id
        //and if its not match then return the regular post

        posts: state.posts.map((post) =>
          post._id === payload.postId ? { ...post, likes: payload.likes } : post
        ),

        loading: false,
      };
    case ADD_COMMENT:
        return {
            ...state,
            post: {...state.post, comments: payload},
            loading: false
        }
    case REMOVE_COMMENT:
        return {
            ...state,
            post: {
                ...state.post,
                comments: state.post.comments.filter(comment => comment._id !== payload)
            },
            loading: false
        }
    default:
      return state;
  }
}
