import React, { useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import { Button } from "@material-ui/core";
import { connect } from "react-redux";
import { clearOrders } from "../redux/actions";
const orderColumns = [
  { field: "customerName", headerName: "Customer Name", width: 200 },
  {
    field: "itemsIds",
    headerName: "Items",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 400,
    valueGetter: params => {
      const items = params.getValue("items");
      const itemIds = items.map(item => item.id);
      return itemIds.join(", ");
    },
  },
];

const Orders = props => {
  return (
    <React.Fragment>
      <h2>Orders</h2>
      <DataGrid
        hideFooter={true}
        autoHeight={true}
        rows={props.orders}
        columns={orderColumns}
      />
    </React.Fragment>
  );
};

const mapDispatchToProps = dispatch => ({
  clearOrders: () => dispatch(clearOrders()),
});

const mapStateToProps = state => {
  return {
    orders: state.orders,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Orders);
