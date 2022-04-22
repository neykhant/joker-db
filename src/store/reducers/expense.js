import { DELETE_EXPENSE, SHOW_EXPENSE, SHOW_EXPENSES } from "../type";

const initialState = {
  expenses: [],
  expense: {},
};

const expense = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_EXPENSES:
      return {
        ...state,
        expenses: action.payload,
      };
    case SHOW_EXPENSE:
      return {
        ...state,
        expense: action.payload,
      };
    case DELETE_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.filter(
          (expense) => expense.id !== action.payload
        ),
      };
    default:
      return state;
  }
};

export default expense;
