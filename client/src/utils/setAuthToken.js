import axios from 'axios';


// This function checks to see if there is a token, and if there is
// it adds the token to the headers
// This function just helps to send the token with every request instead of
// just sending to only authenticated routes
const setAuthToken = token => {
    if (token) {
        axios.defaults.headers.common['x-auth-token'] = token;
    } else {
        delete axios.defaults.headers.common['x-auth-token'];
    }
}

export default setAuthToken;