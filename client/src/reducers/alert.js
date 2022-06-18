import { SET_ALERT, REMOVE_ALERT } from "../actions/types";

//this is just a function that takes in pieace of state and these state has do alert and action
//and action is going to dispacth from action file
const initialState = [];

//this function going to take state which is by default initialstate and an action now that action will contain two  mandotery thing first is 'type' and that payload which will be the data

export default function(state = initialState,action) {
    const {type, payload} = action;
    switch(type){  //depending on the type we decide what we want to send daown as far as state 
        case SET_ALERT:  //dispatch the type set alert
            //return state of an array
            return [...state,payload];  //return the array with the payload
        case REMOVE_ALERT:
            return state.filter(alert => alert.id !== payload); //and then this return all alert except for the that does not matches the payload
        default:
            return state;    
    }
}
