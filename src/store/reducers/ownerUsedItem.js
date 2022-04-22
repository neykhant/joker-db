import { DELETE_OWNER_USED_ITEM, SHOW_OWNER_USED_ITEMS } from "../type";

const initialState = {
  ownerUsedItems: [],
};

const ownerUsedItem = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_OWNER_USED_ITEMS:
      return {
        ...state,
        ownerUsedItems: action.payload,
      };
    case DELETE_OWNER_USED_ITEM:
      return {
        ...state,
        ownerUsedItems: state.ownerUsedItems.filter(
          (ownerUsedItem) => ownerUsedItem.id !== action.payload
        ),
      };
    default:
      return state;
  }
};

export default ownerUsedItem;
