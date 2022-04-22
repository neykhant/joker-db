import axios from "axios";

export const host = "http://joker-api.92134691-30-20190705152935.webstarterz.com/api/v1";

export const setAccessToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

export const call = async (method, path, data) => {
  const response = await axios[method](`${host}/${path}`, data);
  return response.data;
};