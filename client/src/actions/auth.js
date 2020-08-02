import axios from 'axios';
import { setAlert } from './alert';
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL
} from './types';

// Register User
// Register takes in the user info formatted as an object
export const register = ({ name, email, password }) => async dispatch => {
    const config = {
        headers: {
            'Content-Type':'application/json'
        }
    }

    const body = JSON.stringify({ name, email, password });

    try {
        const res = await axios.post('/api/users', body, config);
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        })
    } catch (err) {
        // err.response.data.errors is from the array of errors that
        // is created by the express-validator library when there are errors
        // In root folder, check users/js in routes/api/ where the validation of
        // the user data takes place
        const errors = err.response.data.errors;
        if (errors) {
           return errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type: REGISTER_FAIL
        })
    }
}