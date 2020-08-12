import axios from "axios";
import { setAlert } from "./alert";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
  CLEAR_PROFILE,
  GET_PROFILE,
} from "./types";
import setAuthToken from "../utils/setAuthToken";

// Load User
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get("/api/auth");

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Register User
// Register takes in the user info formatted as an object
export const register = (name, email, password) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ name, email, password });

  try {
    const res = await axios.post("/api/users", body, config);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });

    dispatch(setAlert("Account Created", "success"));

    dispatch(loadUser());
  } catch (err) {
    // err.response.data.errors is from the array of errors that
    // is created by the express-validator library when there are errors
    // In root folder, check users/js in routes/api/ where the validation of
    // the user data takes place
    const errors = err.response.data.errors;
    if (errors) {
      return errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

//Login User
export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ email, password });

  dispatch({ type: CLEAR_PROFILE });

  try {
    const res = await axios.post("/api/auth", body, config);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    dispatch(setAlert("Logged In", "success"));

    dispatch(loadUser());
  } catch (err) {
    // err.response.data.errors is from the array of errors that
    // is created by the express-validator library when there are errors
    // In root folder, check users/js in routes/api/ where the validation of
    // the user data takes place
    const errors = err.response.data.errors;
    if (errors) {
      return errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

// Logout / Clear Profile
export const logout = () => async (dispatch) => {
  dispatch({
    type: CLEAR_PROFILE,
  });

  dispatch({
    type: LOGOUT,
  });

  dispatch(setAlert("User Logged Out", "success"));
};
