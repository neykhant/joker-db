import { DELETE_SHOP, SHOW_SHOP, SHOW_SHOPS } from "../type";

const initialState = {
  shops: [],
  shop: {},
};

const shop = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_SHOPS:
      return {
        ...state,
        shops: action.payload,
      };
    case SHOW_SHOP:
      return {
        ...state,
        shop: action.payload,
      };
    case DELETE_SHOP:
      return {
        ...state,
        shops: state.shops.filter((shop) => shop.id !== action.payload),
      };
    default:
      return state;
  }
};

export default shop;
