import {
  DELETE_PURCHASE,
  SHOW_PURCHASE,
  SHOW_PURCHASES,
  SHOW_PURCHASE_REPORT,
} from "../type";

const initialState = {
  purchases: [],
  purchase: {},
  purchaseReport: [],
};

const purchase = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_PURCHASES:
      return {
        ...state,
        purchases: action.payload,
      };
    case SHOW_PURCHASE_REPORT:
      return {
        ...state,
        purchaseReport: action.payload,
      };
    case SHOW_PURCHASE:
      return {
        ...state,
        purchase: action.payload,
      };
    case DELETE_PURCHASE:
      return {
        ...state,
        purchases: state.purchases.filter(
          (purchase) => purchase.id !== action.payload
        ),
      };
    default:
      return state;
  }
};

export default purchase;
