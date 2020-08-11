import { v4 as uuidv4 } from "uuid";

import { SET_ALERT, REMOVE_ALERT } from "./types";

// dispatch can be used because of redux-thunk middleware in Store.js
// This is done so i can dispatch more than one action-type from this function
export const setAlert = (msg, alertType, timeout = 3300) => (dispatch) => {
  const id = uuidv4();
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id },
  });

  // setTimeout() is used so i can remove the alert after 4 seconds
  // Check the alert reducer for clarity
  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
};
