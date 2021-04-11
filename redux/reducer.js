import { combineReducers } from "redux";
import { v4 } from "uuid";

const breadsReducer = (
  state = [
    { id: "sourdough", flavor: "Sourdough" },
    { id: "whole_grain", flavor: "Whole grain" },
    { id: "banana", flavor: "Banana" },
  ],
  action
) => {
  switch (action.type) {
    case "ADD_BREAD":
      let id = action.payload.replace(/ /g, "_").toLowerCase();
      return [...state, { id, flavor: action.payload }];
    case "CLEAR_BREADS":
      return [];
    default:
      return state;
  }
};
const ordersReducer = (
  state = [
    {
      id: v4(),
      customerName: "Customer1",
      items: [{ id: "sourdough_pan", type: "pan", flavor: "sourdough" }],
    },
    {
      id: v4(),
      customerName: "Customer2",
      items: [{ id: "banana_pan", type: "pan", flavor: "banana" }],
    },
  ],
  action
) => {
  switch (action.type) {
    case "ADD_ORDER":
      const order = action.payload;
      order.id = v4();
      return [...state, order];
    case "CLEAR_ORDERS":
      return [];

    default:
      return state;
  }
};

const rootReducer = combineReducers({
  breads: breadsReducer,
  orders: ordersReducer,
});

export default rootReducer;
