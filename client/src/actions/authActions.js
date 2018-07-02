import setAuthToken from "../utils/setAuthToken";
import axios from "axios";
import jwt_decode from "jwt-decode";

import { GET_ERRORS, SET_CURRENT_USER } from "./types";

//Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("api/users/register", userData)
    .then(res => history.push("/login"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Login- Get JWT token

export const loginUser = userData => dispatch => {
  axios
    .post("api/users/login", userData)
    .then(res => {
      // Save to localstorage
      const { token } = res.data;
      // set token to ls
      localStorage.setItem("jwtToken", token);
      // Set token to auth header
      setAuthToken(token);
      // Decode token to get user data
      const decode = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decode));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set logged in User
export const setCurrentUser = decode => {
  return {
    type: SET_CURRENT_USER,
    payload: decode
  };
};

// Log user out

export const logoutUser = () => dispatch => {
  // Remove token from localStoraage
  localStorage.removeItem("jwtToken");
  // remove token from auth headers for future requests
  setAuthToken(false);
  // set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};
