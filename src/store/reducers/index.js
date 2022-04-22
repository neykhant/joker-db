import { combineReducers } from "redux";
import status from "./status";
import error from "./error";
import auth from "./auth";
import shop from "./shop";
import merchant from "./merchant";
import member from "./member";
import itemName from "./itemName";
import item from "./item";
import stock from "./stock";
import purchase from "./purchase";
import itemTransfer from "./itemTransfer";
import ownerUsedItem from "./ownerUsedItem";
import damageItem from "./damageItem";
import expenseName from "./expenseName";
import expense from "./expense";
import sale from "./sale";

const reducers = combineReducers({
  status,
  error,
  auth,
  shop,
  merchant,
  member,
  itemName,
  item,
  stock,
  purchase,
  itemTransfer,
  ownerUsedItem,
  damageItem,
  expenseName,
  expense,
  sale,
});

export default reducers;
