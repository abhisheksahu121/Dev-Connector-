//it just a function that takes an token if the token is there then added to the header if not then deleted from the header
import axios from "axios";

const setAuthToken = (token) => {
  //here token as a parameter and we check for it that the token comes from localstorage or not
  //check if it is in localstorage or not if it is then set the global header
  if (token) {
    axios.defaults.headers.common["x-auth-token"] = token;
  }
  //if it is not then deleted from the local storage
  else {
    //when we have a token we just send it with every request rather than cooseing with request sendet
    delete axios.defaults.headers.common["x-auth-token"];
  }
};

export default setAuthToken;
