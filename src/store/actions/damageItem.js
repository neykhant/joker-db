import { call } from "../../services/api";
import { serverErrorMessage } from "../../util/messages";
import {
  ADD_ERROR,
  DELETE_DAMAGE_ITEM,
  REMOVE_ERROR,
  SET_LOADING,
  SET_SUCCESS,
  SHOW_DAMAGE_ITEMS,
} from "../type";

export const getDamageItems = () => {
  return async (dispatch) => {
    dispatch({ type: SET_LOADING });
    try {
      const response = await call("get", "damage-items");
      const result = response.data;

      const transfromResult = result.map((data) => {
        return {
          ...data,
          key: data.id,
        };
      });
      dispatch({
        type: SHOW_DAMAGE_ITEMS,
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

export const createDamageItem = (data) => {
  return async (dispatch) => {
    dispatch({ type: SET_SUCCESS, payload: false });
    dispatch({ type: SET_LOADING });
    try {
      await call("post", "damage-items/batchInsert", data);

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

export const deleteDamageItem = (id) => {
  return async (dispatch) => {
    dispatch({ type: SET_SUCCESS, payload: false });
    dispatch({ type: SET_LOADING });
    try {
      await call("delete", `damage-items/${id}`);

      dispatch({ type: SET_SUCCESS, payload: true });
      dispatch({ type: DELETE_DAMAGE_ITEM, payload: id });
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
