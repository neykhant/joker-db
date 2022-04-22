import {
  DELETE_EXPENSE_NAME,
  SHOW_EXPENSE_NAME,
  SHOW_EXPENSE_NAMES,
} from "../type";

const initialState = {
  expenseNames: [],
  expenseName: {},
};

const expenseName = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_EXPENSE_NAMES:
      return {
        ...state,
        expenseNames: action.payload,
      };
    case SHOW_EXPENSE_NAME:
      return {
        ...state,
        expenseName: action.payload,
      };
    case DELETE_EXPENSE_NAME:
      return {
        ...state,
        expenseNames: state.expenseNames.filter(
          (expenseName) => expenseName.id !== action.payload
        ),
      };
    default:
      return state;
  }
};

export default expenseName;
