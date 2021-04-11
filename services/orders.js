// Rules
// 1 - Either pan or round loaf for the same flavor.
// 2 - Every customer will get at least one product matching their exact specifications.
// 3-  Few round loaves as possible

const getOtherTypeItemId = item => {
  const otherTypeItemId = item.type === "round" ? "pan" : "round";
  return `${item.flavor}_${otherTypeItemId}`;
};

const hasTypeConflict = (item, ordersPerItemId) => {
  const otherTypeItemId = getOtherTypeItemId(item);
  return ordersPerItemId[otherTypeItemId] ? true : false;
};

const willTheOrderHaveOrAlreadyHasAnItemWithoutConflict = (
  order,
  ordersPerItemId
) =>
  order.items.some(
    item =>
      ordersPerItemId[order.id] || // Is there something already confirmed?
      !hasTypeConflict(item, ordersPerItemId) // Is there something without conflict in this order?
  );

const getSwappableItems = (items, ordersPerItemId) => {
  // Try to find at least one swap possible;
  // The only way to do that is to swap the type of bread for all customers
  // that requires the same flavor but other type
  const swappableItems = [];
  for (const item of items) {
    let swappableItem = true;
    const conflictingItemId = getOtherTypeItemId(item);
    const orders = ordersPerItemId[conflictingItemId];

    for (const order of orders) {
      if (order.items.length === 1) {
        swappableItem = false;
        break;
      }
    }

    if (swappableItem) swappableItems.push(item);
  }
  return swappableItems;
};

const swapItems = (swappableItems, ordersPerItemId) => {
  // If there is an item of type pan we should swap it for optimization (Rule 3)
  const typePanSwappableItems = swappableItems.filter(
    item => item.type === "pan"
  );

  const itemToSwap = typePanSwappableItems.length
    ? typePanSwappableItems[0]
    : swappableItems[0];

  //Time to swap!
  const itemToSwapId = itemToSwap.id;
  const itemToSwapOtherId = getOtherTypeItemId(itemToSwap);
  const ordersToSwap = ordersPerItemId[itemToSwapOtherId];

  for (const order of ordersToSwap) {
    const item = order.items.find(item => item.id === itemToSwapOtherId);
    item.id = itemToSwapId;
    item.type === "pan" ? "round" : "pan";
    item.swapped = true;
  }

  ordersPerItemId[itemToSwapId] = ordersToSwap;
  delete ordersPerItemId[itemToSwapOtherId];
};

const getConflictedCustomerNames = (order, ordersPerItemId) => {
  const conflictedOrderCustomers = {};
  for (const item of order.items) {
    const conflictItemId = getOtherTypeItemId(item);
    const conflictedOrders = ordersPerItemId[conflictItemId];
    for (const conflictedOrder of conflictedOrders) {
      conflictedOrderCustomers[conflictedOrder.customerName] = true;
    }
  }
  return Object.keys(conflictedOrderCustomers);
};

const resolveConflict = (order, ordersPerItemId) => {
  const orderItems = order.items;
  const swappableItems = getSwappableItems(orderItems, ordersPerItemId);
  if (!swappableItems.length) {
    // If there is no swappable item, so throw an error with conflict customerNames
    const conflictedCustomerNames = getConflictedCustomerNames(
      order,
      ordersPerItemId
    );
    // Add the current order customer name as well
    conflictedCustomerNames.push(order.customerName);
    const error = new Error("Unable to resolve conflict");
    error.conflictedCustomerNames = conflictedCustomerNames;
    throw error;
  } else {
    swapItems(swappableItems, ordersPerItemId);
  }
};

const validateCustomerWithTwoTypesOfSameFlavor = (order, item) => {
  const otherTypeId = getOtherTypeItemId(item);
  const otherTypeInSameOrder = order.items.some(
    item => item.id === otherTypeId
  );
  if (otherTypeInSameOrder) {
    const error = new Error("Customer cannot request two flavors of same type");
    error.conflictedCustomerNames = [order.customerName];
    throw error;
  }
};

module.exports.process = orders => {
  const ordersPerItemId = {};
  const ordersWithConflict = [];

  for (const order of orders) {
    for (const item of order.items) {
      //
      validateCustomerWithTwoTypesOfSameFlavor(order, item);
      // Check if there is already a confirmed leave with same flavor but other type
      if (hasTypeConflict(item, ordersPerItemId)) {
        // Yes there is, can we replace something?
        // Check if is there already something confirmed or that will eventually not conflict in this order
        if (
          willTheOrderHaveOrAlreadyHasAnItemWithoutConflict(
            order,
            ordersPerItemId
          )
        ) {
          // Yup, no worries! This customer will get at least one leave
        } else {
          //Nope, lets try to resolve this conflict
          resolveConflict(order, ordersPerItemId, ordersWithConflict);
        }
      } else {
        // All good, it will be added as a possible item to bake.
        // Keeping track of the order as well, it will make it easier to solve conflicts
        if (!ordersPerItemId[item.id]) {
          ordersPerItemId[item.id] = [order];
        } else {
          ordersPerItemId[item.id].push(order);
        }
      }
    }
  }
  const itemIds = Object.keys(ordersPerItemId);
  let listOfItems = [];

  for (const itemId of itemIds) {
    for (const order of ordersPerItemId[itemId]) {
      for (const item of order.items) {
        if (item.id === itemId) listOfItems.push(item);
        break;
      }
    }
  }

  return { itemIds, listOfItems };
};
