import {
  CREATE_SALE,
  DELETE_SALE,
  SALE_REPORT,
  SHOW_SALE,
  SHOW_SALES,
} from "../type";

const initialState = {
  sales: [],
  sale: {},
  saleReport: [],
};

const sale = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_SALES:
      return {
        ...state,
        sales: action.payload,
      };
    case SALE_REPORT:
      return {
        ...state,
        saleReport: [action.payload],
      };
    case SHOW_SALE:
      return {
        ...state,
        sale: action.payload,
      };
    case CREATE_SALE:
      return {
        ...state,
        sale: action.payload,
      };
    case DELETE_SALE:
      return {
        ...state,
        sales: state.sales.filter((sale) => sale.id !== action.payload),
      };
    default:
      return state;
  }
};

export default sale;
