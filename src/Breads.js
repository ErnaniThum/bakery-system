import React, { useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import { connect } from "react-redux";
const breadColumns = [{ field: "flavor", headerName: "Bread", width: 200 }];

const Breads = props => {
  return (
    <React.Fragment>
      <h2>Breads</h2>

      <DataGrid
        hideFooter={true}
        autoHeight={true}
        rows={props.breads}
        columns={breadColumns}
      />
    </React.Fragment>
  );
};

const mapStateToProps = state => {
  return {
    breads: state.breads,
  };
};

export default connect(mapStateToProps)(Breads);
