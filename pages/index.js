import React, { useState } from "react";
import {
  Modal,
  Grid,
  Box,
  Divider,
  Button,
  Container,
  TextField,
  makeStyles,
} from "@material-ui/core";
import CreateOrder from "../src/CreateOrder";
import Breads from "../src/Breads";
import Orders from "../src/Orders";
import OrderResults from "../src/OrderResult";
import { connect } from "react-redux";
import { clearOrders, clearBreads, addBread } from "../redux/actions";
const useStyles = makeStyles(theme => ({
  root: {
    height: 600,
    minHeight: 600,
    flexGrow: 1,
    minWidth: 300,
    transform: "translateZ(0)",
    // The position fixed scoping doesn't work in IE 11.
    // Disable this demo to preserve the others.
    "@media all and (-ms-high-contrast: none)": {
      display: "none",
    },
  },
  modal: {
    display: "flex",
    padding: theme.spacing(1),
    alignItems: "center",
    justifyContent: "center",
  },
}));

const Index = props => {
  const classes = useStyles();
  const rootRef = React.useRef(this);
  const [modalStatus, setModalStatus] = useState(false);
  const [newBreadName, setNewBreadName] = useState("");
  const openModal = id => {
    setModalStatus(id);
  };
  const closeModal = () => {
    setModalStatus(null);
  };

  const onNewBreadNameChange = event => {
    setNewBreadName(event.target.value);
  };

  const onAddBreadClick = () => {
    props.addBread(newBreadName);
    setNewBreadName("");
  };

  let modalComponent = null;
  if (modalStatus === "createOrder") {
    modalComponent = <CreateOrder setModalClosed={closeModal} />;
  }
  if (modalStatus === "processOrders") {
    modalComponent = <OrderResults setModalClosed={closeModal} />;
  }

  return (
    <Container>
      <Grid container direction="row" alignItems="flex-start" spacing={2}>
        <Grid item xs={12}>
          <h1>Backery System</h1>
          <Divider />
        </Grid>
        <Box></Box>
        <Grid item md={6} xs={12}>
          <Breads />
          <Box display="flex" justifyItems="center" alignItems="center">
            <Box paddingRight="20px">
              <TextField
                label="Add Bread"
                placeholder="Bread Name"
                margin="normal"
                onChange={onNewBreadNameChange}
                value={newBreadName}
              />
            </Box>
            <Box paddingRight="10px">
              <Button
                color="primary"
                variant="contained"
                onClick={onAddBreadClick}
                disabled={!newBreadName.length}
              >
                Add Bread
              </Button>
            </Box>
            <Box>
              <Button
                color="primary"
                variant="contained"
                onClick={props.clearBreads}
                disabled={!props.breads.length}
              >
                Clear Breads
              </Button>
            </Box>
          </Box>
        </Grid>

        <Grid item md={6} xs={12}>
          <Orders setModalClosed={closeModal} />
        </Grid>
        <Grid
          item
          xs={6}
          container
          direction="row"
          justify="space-evenly"
          alignItems="center"
        ></Grid>
        <Grid
          item
          md={6}
          xs={12}
          container
          direction="row"
          justify="space-evenly"
          alignItems="center"
        >
          <Grid item xs={2} className={classes.buttonGrid}>
            <Button
              color="primary"
              variant="contained"
              disabled={!props.breads.length}
              onClick={() => {
                openModal("createOrder");
              }}
            >
              New Order
            </Button>
          </Grid>
          <Grid item xs={2} className={classes.buttonGrid}>
            <Button
              color="primary"
              variant="contained"
              onClick={props.clearOrders}
              disabled={!props.orders.length}
            >
              Clear Orders
            </Button>
          </Grid>
          <Grid item xs={2} className={classes.buttonGrid}>
            <Button
              color="primary"
              variant="contained"
              onClick={() => openModal("processOrders")}
              disabled={!props.orders.length}
            >
              Process Orders
            </Button>
          </Grid>
        </Grid>
      </Grid>
      {modalComponent ? (
        <Modal
          disablePortal
          disableEnforceFocus
          disableAutoFocus
          open={!!modalStatus}
          aria-labelledby="server-modal-title"
          aria-describedby="server-modal-description"
          className={classes.modal}
          container={() => rootRef.current}
        >
          {modalComponent}
        </Modal>
      ) : null}
    </Container>
  );
};

const mapDispatchToProps = dispatch => ({
  clearOrders: () => dispatch(clearOrders()),
  clearBreads: () => dispatch(clearBreads()),
  addBread: breadName => dispatch(addBread(breadName)),
});

const mapStateToProps = state => ({
  orders: state.orders,
  breads: state.breads,
});

export default connect(mapStateToProps, mapDispatchToProps)(Index);
