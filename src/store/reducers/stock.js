import { SHOW_STOCKS } from "../type";

const initialState = {
  stocks: [],
};

const stock = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_STOCKS:
      return {
        ...state,
        stocks: action.payload,
      };
    default:
      return state;
  }
};

export default stock;
