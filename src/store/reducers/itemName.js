import { DELETE_ITEM_NAME, SHOW_ITEM_NAME, SHOW_ITEM_NAMES } from "../type";

const initialState = {
  itemNames: [],
  itemName: {},
};

const itemName = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_ITEM_NAMES:
      return {
        ...state,
        itemNames: action.payload,
      };
    case SHOW_ITEM_NAME:
      return {
        ...state,
        itemName: action.payload,
      };
    case DELETE_ITEM_NAME:
      return {
        ...state,
        itemNames: state.itemNames.filter(
          (itemName) => itemName.id !== action.payload
        ),
      };
    default:
      return state;
  }
};

export default itemName;
