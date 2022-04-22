import { DELETE_DAMAGE_ITEM, SHOW_DAMAGE_ITEMS } from "../type";

const initialState = {
  damageItems: [],
};

const damageItem = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_DAMAGE_ITEMS:
      return {
        ...state,
        damageItems: action.payload,
      };
    case DELETE_DAMAGE_ITEM:
      return {
        ...state,
        damageItems: state.damageItems.filter(
          (damageItem) => damageItem.id !== action.payload
        ),
      };
    default:
      return state;
  }
};

export default damageItem;
