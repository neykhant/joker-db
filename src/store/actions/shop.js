import { call } from "../../services/api";
import { serverErrorMessage } from "../../util/messages";
import {
  ADD_ERROR,
  DELETE_SHOP,
  REMOVE_ERROR,
  SET_LOADING,
  SET_SUCCESS,
  SHOW_SHOP,
  SHOW_SHOPS,
} from "../type";

export const getShops = () => {
  return async (dispatch) => {
    dispatch({ type: SET_LOADING });
    try {
      const response = await call("get", "shops");
      const result = response.data;

      const transfromResult = result.map((data) => {
        return {
          ...data,
          key: data.id,
        };
      });
      dispatch({
        type: SHOW_SHOPS,
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

export const getShop = (id) => {
  return async (dispatch) => {
    dispatch({ type: SET_LOADING });
    try {
      const response = await call("get", `shops/${id}`);
      const result = response.data;

      dispatch({
        type: SHOW_SHOP,
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

export const createShop = (data) => {
  return async (dispatch) => {
    dispatch({ type: SET_SUCCESS, payload: false });
    dispatch({ type: SET_LOADING });
    try {
      await call("post", "shops", data);

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

export const editShop = (id, data) => {
  return async (dispatch) => {
    dispatch({ type: SET_SUCCESS, payload: false });
    dispatch({ type: SET_LOADING });
    try {
      await call("post", `shops/${id}?_method=PUT`, data);

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

export const deleteShop = (id) => {
  return async (dispatch) => {
    dispatch({ type: SET_SUCCESS, payload: false });
    dispatch({ type: SET_LOADING });
    try {
      await call("delete", `shops/${id}`);

      dispatch({ type: SET_SUCCESS, payload: true });
      dispatch({ type: DELETE_SHOP, payload: id });
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
