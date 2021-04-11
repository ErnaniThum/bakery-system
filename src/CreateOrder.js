import React, { useState } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { Button, Box, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { DataGrid } from "@material-ui/data-grid";
import { connect } from "react-redux";
import { addOrder } from "../redux/actions";
const itemColumns = [
  { field: "id", headerName: "Item", width: 90 },
  { field: "type", headerName: "Type", width: 200 },
  { field: "flavor", headerName: "Flavor", width: 200 },
];

const useStyles = makeStyles(theme => ({
  order: {
    width: "1200px",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "15px",
  },
}));

const CreateOrder = props => {
  const classes = useStyles();
  const breads = props.breads;
  const defaultBreadId = breads.length ? breads[0].id : "";
  const [name, setName] = useState("");
  const [type, setType] = React.useState("pan");
  const [flavor, setFlavor] = React.useState(defaultBreadId);
  const [items, setItems] = React.useState([]);

  const handleChangeType = event => {
    setType(event.target.value);
  };
  const handleChangeName = event => {
    setName(event.target.value);
  };
  const handleChangeFlavor = event => {
    setFlavor(event.target.value);
  };

  const addItem = () => {
    const newItems = items.concat([{ id: items.length + 1, type, flavor }]);
    setItems(newItems);
  };
  const clearItems = () => {
    setItems([]);
  };

  const addOrder = () => {
    //Data grid component items need id property to be an incremental integer.
    //When finishing order, overriding the id with the bread identifier
    const _items = items.map(item => {
      item.id = `${flavor}_${type}`;
      return item;
    });
    props.addOrder({ customerName: name, items: _items });
    props.setModalClosed();
  };
  return (
    <div className={classes.order}>
      <h2>Create Order</h2>
      <Box paddingBottom="10px">
        <TextField
          label="Customer Name"
          placeholder="Customer 1"
          fullWidth
          margin="normal"
          variant="filled"
          onChange={handleChangeName}
        />
      </Box>

      <Box paddingBottom="10px" display="flex" alignItems="center">
        <Box paddingX="5px">
          <Select value={flavor} variant="filled" onChange={handleChangeFlavor}>
            {breads.map(bread => (
              <MenuItem key={bread.id} value={bread.id}>
                {bread.flavor}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box paddingRight="5px">
          <Select value={type} variant="filled" onChange={handleChangeType}>
            <MenuItem value={"pan"}>Pan</MenuItem>
            <MenuItem value={"round"}>Round</MenuItem>
          </Select>
        </Box>
        <Box paddingX="5px">
          <Button variant="contained" color="primary" onClick={addItem}>
            Add
          </Button>
        </Box>
        <Box paddingX="5px">
          <Button variant="contained" color="primary" onClick={clearItems}>
            Clear
          </Button>
        </Box>
      </Box>
      <DataGrid
        pageSize={5}
        autoHeight={true}
        rows={items}
        columns={itemColumns}
      />
      <footer className={classes.footer}>
        <Button variant="text" color="secondary" onClick={props.setModalClosed}>
          Close
        </Button>
        <Button
          disabled={!items.length || !name}
          variant="contained"
          color="primary"
          onClick={addOrder}
        >
          Place Order
        </Button>
      </footer>
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  addOrder: post => dispatch(addOrder(post)),
});

const mapStateToProps = state => ({
  breads: state.breads,
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateOrder);
