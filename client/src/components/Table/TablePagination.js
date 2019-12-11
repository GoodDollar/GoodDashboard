import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import TablePagination from "@material-ui/core/TablePagination";
// core components
import styles from "assets/jss/material-dashboard-react/components/tablePaginationStyle.js";

const useStyles = makeStyles(styles);

export default function CustomTable(props) {
  const classes = useStyles();
  const { count, page, perPage, onChangePage, onChangeRowsPerPage, rowsPerPageOptions } = props;
  const totalPages = Math.floor(count / perPage);

  const _onChangePage = (event, page) => {
    if (page <= totalPages && page >= 0) {
      onChangePage(page)
    }
  };

  const _onChangeRowsPerPage = (event) => {
    const newPerPage = event && event.target && event.target.value;

    onChangeRowsPerPage(newPerPage || perPage)
  };

  return (
    <div className={classes.wrapper}>
      <TablePagination
        count={count}
        page={page}
        rowsPerPage={perPage}
        onChangePage={_onChangePage}
        onChangeRowsPerPage={_onChangeRowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
      />
    </div>
  );
}

CustomTable.defaultProps = {
  tableHeaderColor: "gray"
};

CustomTable.propTypes = {
  tableHeaderColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "gray"
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.string),
  tableData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
};
