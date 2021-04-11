import React from "react";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import orderServices from "../services/orders";
const useStyles = makeStyles(theme => ({
  order: {
    width: 1200,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const CreateOrder = props => {
  const classes = useStyles();
  let conflictedCustomerNames = null;
  let component = null;
  let listOfItems = null;
  try {
    const ordersResult = orderServices.process(props.orders);
    listOfItems = ordersResult.listOfItems;
  } catch (error) {
    conflictedCustomerNames = error.conflictedCustomerNames;
  }

  if (listOfItems) {
    component = (
      <React.Fragment>
        <h2>Order Process Success!</h2>
        <h3>Breads that will be baked</h3>
        <ul>
          {listOfItems.map(item => (
            <li key={item.id}>{`${item.flavor} ${item.type}`}</li>
          ))}
        </ul>
      </React.Fragment>
    );
  } else {
    component = (
      <React.Fragment>
        <h2>Order Process Failed!</h2>
        <h3>
          There are orders in conflict. Please reach out the following
          customers:
        </h3>
        <ul>
          {conflictedCustomerNames.map(customerName => (
            <li key={customerName}>{customerName}</li>
          ))}
        </ul>
      </React.Fragment>
    );
  }

  return (
    <div className={classes.order}>
      {component}
      <Button variant="text" color="secondary" onClick={props.setModalClosed}>
        Close
      </Button>
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  addOrder: post => dispatch(addOrder(post)),
});

const mapStateToProps = state => ({
  orders: state.orders,
  breads: state.breads,
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateOrder);
