import { call } from "../../services/api";
import { serverErrorMessage } from "../../util/messages";
import {
  ADD_ERROR,
  DELETE_MERCHANT,
  REMOVE_ERROR,
  SET_LOADING,
  SET_SUCCESS,
  SHOW_MERCHANT,
  SHOW_MERCHANTS,
} from "../type";

export const getMerchants = () => {
  return async (dispatch) => {
    dispatch({ type: SET_LOADING });
    try {
      const response = await call("get", "merchants");
      const result = response.data;

      const transfromResult = result.map((data) => {
        return {
          ...data,
          key: data.id,
        };
      });
      dispatch({
        type: SHOW_MERCHANTS,
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

export const getMerchant = (id) => {
  return async (dispatch) => {
    dispatch({ type: SET_LOADING });
    try {
      const response = await call("get", `merchants/${id}`);
      const result = response.data;

      dispatch({
        type: SHOW_MERCHANT,
        payload: result,
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

export const createMerchant = (data) => {
  return async (dispatch) => {
    dispatch({ type: SET_SUCCESS, payload: false });
    dispatch({ type: SET_LOADING });
    try {
      await call("post", "merchants", data);

      dispatch({ type: SET_SUCCESS, payload: true });
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

export const editMerchant = (id, data) => {
  return async (dispatch) => {
    dispatch({ type: SET_SUCCESS, payload: false });
    dispatch({ type: SET_LOADING });
    try {
      await call("post", `merchants/${id}?_method=PUT`, data);

      dispatch({ type: SET_SUCCESS, payload: true });
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

export const deleteMerchant = (id) => {
  return async (dispatch) => {
    dispatch({ type: SET_SUCCESS, payload: false });
    dispatch({ type: SET_LOADING });
    try {
      await call("delete", `merchants/${id}`);

      dispatch({ type: SET_SUCCESS, payload: true });
      dispatch({ type: DELETE_MERCHANT, payload: id });
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
