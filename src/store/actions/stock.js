import { call } from "../../services/api";
import { serverErrorMessage } from "../../util/messages";
import { ADD_ERROR, REMOVE_ERROR, SET_LOADING, SHOW_STOCKS } from "../type";

export const getStocks = () => {
  return async (dispatch) => {
    dispatch({ type: SET_LOADING });
    try {
      const response = await call("get", "stocks");
      const result = response.data;

      const transfromResult = result.map((data) => {
        return {
          ...data,
          key: data.id,
        };
      });
      dispatch({
        type: SHOW_STOCKS,
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
