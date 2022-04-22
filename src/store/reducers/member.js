import { DELETE_MEMBER, SHOW_MEMBER, SHOW_MEMBERS } from "../type";

const initialState = {
  members: [],
  member: {},
};

const member = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_MEMBERS:
      return {
        ...state,
        members: action.payload,
      };
    case SHOW_MEMBER:
      return {
        ...state,
        member: action.payload,
      };
    case DELETE_MEMBER:
      return {
        ...state,
        members: state.members.filter((member) => member.id !== action.payload),
      };
    default:
      return state;
  }
};

export default member;
