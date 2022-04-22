import { setAccessToken, call } from "../../services/api";
import { serverErrorMessage } from "../../util/messages";
import {
  ADD_ERROR,
  DELETE_USER,
  REMOVE_ERROR,
  SET_CURRENT_USER,
  SET_LOADING,
  SET_SUCCESS,
  SHOW_USERS,
} from "../type";

export const logout = () => {
  return async (dispatch) => {
    await call("get", "logout");
    localStorage.removeItem("jwtToken");
    setAccessToken(null);
    dispatch({
      type: SET_CURRENT_USER,
      payload: {},
    });
    dispatch({
      type: REMOVE_ERROR,
    });
  };
};

export const authUser = (path, data) => {
  return async (dispatch) => {
    dispatch({ type: SET_LOADING });
    dispatch({
      type: REMOVE_ERROR,
    });
    try {
      const response = await call("post", `${path}`, data);
      const { name, phone, position, shop, access_token } = response.data;

      localStorage.setItem("jwtToken", access_token);
      dispatch({
        type: SET_CURRENT_USER,
        payload: { name, phone, position, shop },
      });
      dispatch({
        type: REMOVE_ERROR,
      });
      setAccessToken(access_token);
    } catch (error) {
      const { status, data } = error.response;

      if (status === 401) {
        localStorage.removeItem("jwtToken");
        dispatch({
          type: ADD_ERROR,
          payload: data.data.message,
        });
      }
      if (status === 500) {
        dispatch({
          type: ADD_ERROR,
          payload: serverErrorMessage,
        });
      }
    }
    dispatch({ type: SET_LOADING });
  };
};

export const registerUser = (data) => {
  return async (dispatch) => {
    dispatch({
      type: SET_SUCCESS,
      payload: false,
    });
    dispatch({ type: SET_LOADING });
    try {
      await call("post", "io-register", data);

      dispatch({
        type: SET_SUCCESS,
        payload: true,
      });
      dispatch({
        type: REMOVE_ERROR,
      });
    } catch (error) {
      const { status, data } = error.response;

      if (status === 401) {
        localStorage.removeItem("jwtToken");
        dispatch({
          type: ADD_ERROR,
          payload: data.data.message,
        });
      }
      if (status === 422) {
        dispatch({
          type: ADD_ERROR,
          payload: data.errors.phone[0],
        });
      }
      if (status === 500) {
        dispatch({
          type: ADD_ERROR,
          payload: serverErrorMessage,
        });
      }
    }
    dispatch({
      type: SET_SUCCESS,
      payload: false,
    });
    dispatch({ type: SET_LOADING });
  };
};

export const getUser = () => {
  return async (dispatch) => {
    dispatch({ type: SET_LOADING });
    try {
      const response = await call("get", "user");
      const { name, phone, position, shop } = response.data;

      dispatch({
        type: SET_CURRENT_USER,
        payload: { name, phone, position, shop },
      });
      dispatch({
        type: REMOVE_ERROR,
      });
    } catch (error) {
      const { status, data } = error.response;

      if (status === 401) {
        localStorage.removeItem("jwtToken");
        dispatch({
          type: ADD_ERROR,
          payload: data.message,
        });
      }
      if (status === 500) {
        dispatch({
          type: ADD_ERROR,
          payload: serverErrorMessage,
        });
      }
    }
    dispatch({ type: SET_LOADING });
  };
};

export const getUsers = () => {
  return async (dispatch) => {
    dispatch({ type: SET_LOADING });

    try {
      const response = await call("get", "users");
      const result = response.data;

      const transfromResult = result.map((data) => {
        return {
          ...data,
          key: data.id,
        };
      });

      dispatch({
        type: SHOW_USERS,
        payload: transfromResult,
      });
      dispatch({
        type: REMOVE_ERROR,
      });
    } catch (error) {
      const { status, data } = error.response;

      if (status === 401) {
        localStorage.removeItem("jwtToken");
        dispatch({
          type: ADD_ERROR,
          payload: data.message,
        });
      }

      if (status === 500) {
        dispatch({
          type: ADD_ERROR,
          payload: serverErrorMessage,
        });
      }
    }
    dispatch({ type: SET_LOADING });
  };
};

export const deleteUser = (id) => {
  return async (dispatch) => {
    dispatch({ type: SET_SUCCESS, payload: false });
    dispatch({ type: SET_LOADING });
    try {
      await call("delete", `users/${id}`);

      dispatch({ type: SET_SUCCESS, payload: true });
      dispatch({ type: DELETE_USER, payload: id });
      dispatch({
        type: REMOVE_ERROR,
      });
    } catch (error) {
      const { status, data } = error.response;

      if (status === 401) {
        localStorage.removeItem("jwtToken");
        dispatch({
          type: ADD_ERROR,
          payload: data.message,
        });
      }

      if (status === 500) {
        dispatch({
          type: ADD_ERROR,
          payload: serverErrorMessage,
        });
      }
    }
    dispatch({ type: SET_SUCCESS, payload: false });
    dispatch({ type: SET_LOADING });
  };
};
