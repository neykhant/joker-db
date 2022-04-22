import { DELETE_USER, SET_CURRENT_USER, SHOW_USERS } from "../type";

const initialState = {
  isAuthenticated: false,
  user: {},
  users: [],
};

const auth = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !!Object.keys(action.payload).length,
        user: action.payload,
      };
    case SHOW_USERS:
      return {
        ...state,
        users: action.payload,
      };
    case DELETE_USER:
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.payload),
      };
    default:
      return state;
  }
};

export default auth;
