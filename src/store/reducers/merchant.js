import { DELETE_MERCHANT, SHOW_MERCHANT, SHOW_MERCHANTS } from "../type";

const initialState = {
  merchants: [],
  merchant: {},
};

const merchant = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_MERCHANTS:
      return {
        ...state,
        merchants: action.payload,
      };
    case SHOW_MERCHANT:
      return {
        ...state,
        merchant: action.payload,
      };
    case DELETE_MERCHANT:
      return {
        ...state,
        merchants: state.merchants.filter(
          (merchant) => merchant.id !== action.payload
        ),
      };
    default:
      return state;
  }
};

export default merchant;
