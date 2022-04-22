import { DELETE_ITEM_TRANSFER, SHOW_ITEM_TRANSFERS } from "../type";

const initialState = {
  itemTransfers: [],
};

const itemTransfer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_ITEM_TRANSFERS:
      return {
        ...state,
        itemTransfers: action.payload,
      };
    case DELETE_ITEM_TRANSFER:
      return {
        ...state,
        itemTransfers: state.itemTransfers.filter((itemTransfer) => itemTransfer.id !== action.payload),
      };
    default:
      return state;
  }
};

export default itemTransfer;
