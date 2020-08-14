import api from "./api";

// This function checks to see if there is a token, and if there is
// it adds the token to the headers
// This function just helps to send the token with every request instead of
// just sending to only authenticated routes
const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["x-auth-token"] = token;
    localStorage.setItem("token", token);
  } else {
    delete api.defaults.headers.common["x-auth-token"];
    localStorage.removeItem("token");
  }
};

export default setAuthToken;
