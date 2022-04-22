import {
  DELETE_ITEM,
  SHOW_BEST_ITEMS,
  SHOW_INVOICE_ITEMS,
  SHOW_ITEM,
  SHOW_ITEMS,
} from "../type";

const initialState = {
  items: [],
  item: {},
  invoiceItems: [],
  bestItems: [],
};

const item = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_ITEMS:
      return {
        ...state,
        items: action.payload,
      };
    case SHOW_INVOICE_ITEMS:
      return {
        ...state,
        invoiceItems: action.payload,
      };
    case SHOW_BEST_ITEMS:
      return {
        ...state,
        bestItems: action.payload,
      };
    case SHOW_ITEM:
      return {
        ...state,
        item: action.payload,
      };
    case DELETE_ITEM:
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    default:
      return state;
  }
};

export default item;
