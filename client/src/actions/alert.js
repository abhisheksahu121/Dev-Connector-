import uuid from "uuid/v4";
import { SET_ALERT, REMOVE_ALERT } from "./types";

export const setAlert = (msg, alertType) => dispatch => {
    const id = uuid.v4(); //this will giveus rendom long string 
    dispatch({
        type: SET_ALERT,
        payload: {msg, alertType, id}
    });
};

export default setAlert;