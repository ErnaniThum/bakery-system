import React, { useState } from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import { DataGrid } from '@material-ui/data-grid';
import { Button, Modal } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
const orderColumns = [
  { field: 'id', headerName: 'Order', width: 90  },
  { field: 'customerName', headerName: 'First name', width: 400},
];

const itemColumns = [
  { field: 'id', headerName: 'Item', width: 90  },
  { field: 'type', headerName: 'Type', width: 200},
  { field: 'bread', headerName: 'Bread', width: 200}

];

const useStyles = makeStyles((theme) => ({
  root: {
    height: 600,
    minHeight:600,
    flexGrow: 1,
    minWidth: 300,
    transform: 'translateZ(0)',
    // The position fixed scoping doesn't work in IE 11.
    // Disable this demo to preserve the others.
    '@media all and (-ms-high-contrast: none)': {
      display: 'none',
    },
  },
  modal: {
    display: 'flex',
    padding: theme.spacing(1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  order: {
    width: 1200,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  }
}));

export default function Index() {
  const classes = useStyles();
  const rootRef = React.useRef(null);
  const [openModal, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [orders, setOrders] = useState([
    { id: 1, customerName: 'Snow', },
    { id: 2, customerName: 'Lannister'}
  ])
  const [type, setType] = React.useState('pan');
  
  const [bread, setBread] = React.useState('sourdough');
  
  const [items, setItems] = React.useState([]);

  const handleChangeType = (event) => {
    setType(event.target.value);
  };
  const handleChangeName = (event) => {
    setName(event.target.value);
  };
  const handleChangeBread = (event) => {
    setBread(event.target.value);
  };

  const addOrder = () => {
    const newOrders = orders.concat([{id: orders.length + 1, customerName: name}])
    setOrders(newOrders);
    setModalOpen(false);
  }
  const addItem = () => {
    const newItems = items.concat([{id: items.length + 1, type, bread}])
    setItems(newItems);
  }
  const clearOrders = () => {
    setOrders([]);
  }
  const clearItems = () => {
    setItems([]);
  }

  return (
    <Container maxWidth="sm">
      <Box my={4}>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={orders} columns={orderColumns} pageSize={5} checkboxSelection />
      </div>
      </Box>
      <Button variant="contained" color="primary" onClick={() => {setModalOpen(true)}}>Add</Button>
      <Button variant="contained" color="primary" onClick={clearOrders}>Clear</Button>
      <Modal
        disablePortal
        disableEnforceFocus
        disableAutoFocus
        open={openModal}
        aria-labelledby="server-modal-title"
        aria-describedby="server-modal-description"
        className={classes.modal}
        container={() => rootRef.current}
      >
        <div className={classes.order}>
          <h2 id="server-modal-title">Create Order</h2>

          <TextField
            id="filled-full-width"
            label="Customer"
            placeholder="Customer Name"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            variant="filled"
            onChange={handleChangeName}
          />
          
          <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={type}
          onChange={handleChangeType}
          >
            <MenuItem value={'pan'}>Pan</MenuItem>
            <MenuItem value={'rounded'}>Rounded</MenuItem>
          </Select>

          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={ bread }
            onChange={handleChangeBread}
          >
            <MenuItem value={'wholeGrain'}>Whole Grain</MenuItem>
            <MenuItem value={'banana'}>Banana</MenuItem>
            <MenuItem value={'sourdough'}>Sourdough</MenuItem>
          </Select>
          <Button variant="contained" color="primary" onClick={addItem}>Add</Button>
          <Button variant="contained" color="primary" onClick={clearItems}>Clear</Button>
          <div style={{ height: 300, width: '80%', 'padding-top': 10 }}>
            <DataGrid rows={items} columns={itemColumns} pageSize={5} checkboxSelection />
          </div>
          <Button variant="contained" color="primary" onClick={addOrder}>Place Order</Button>
        </div>
      </Modal>
    </Container>
  );
}


