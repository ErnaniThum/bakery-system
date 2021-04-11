const addOrder = order => ({
  type: "ADD_ORDER",
  payload: order,
});
const clearOrders = () => ({
  type: "CLEAR_ORDERS",
});

const addBread = bread => ({
  type: "ADD_BREAD",
  payload: bread,
});
const clearBreads = () => ({
  type: "CLEAR_BREADS",
});
export { addOrder, clearOrders, addBread, clearBreads };
