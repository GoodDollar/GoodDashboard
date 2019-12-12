import React, { useState} from 'react'
// @material-ui/core components
import {makeStyles} from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import BackupIcon from "@material-ui/icons/Backup";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import TablePagination from "components/Table/TablePagination.js";
import Card from "components/Card/Card.js";
import Balance from "components/Balance"
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import {
  useGetSurveySummaryTable,
} from 'hooks/api'
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import Config from '../../config';

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    margin: 'auto 0',
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  exportButton: {
    padding: 8,
    color: 'white',
  },
};

const useStyles = makeStyles(styles);

const DEFAULT_PER_PAGE = 15;

export default function TableList() {
  const classes = useStyles();
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE);
  const [page, setPage] = useState(0);
  const skip = page * perPage;

  const [
    tableData = {
      list: [],
      count: 0,
    },
    rowsLoading
  ] = useGetSurveySummaryTable(
    [
      page,
      perPage,
    ],
    [{
      limit: perPage,
      skip,
    }],
  );
  const rows = tableData.list;
  const totalCount = tableData.count;

  const downloadCSV = () => {
    const downloadUrl = `${Config.apiUrl}/survey/csv`;

    window.open(downloadUrl);
  };

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary" className={classes.header}>
            <h4 className={classes.cardTitleWhite}>Survey Summary Table</h4>
            <IconButton className={classes.exportButton} onClick={downloadCSV}>
              <BackupIcon />
            </IconButton>
          </CardHeader>
          <CardBody>
            {rowsLoading && (
              <GridItem container xs={12} justify="center">
                <CircularProgress/>
              </GridItem>
            )}
            <Table
              tableHeaderColor="primary"
              tableHead={["Date", "Amount", "Survey", "Reason", "Hash"]}
              tableData={[
                ...rows.map(i => [i.date, <Balance amount={i.amount} />, i.survey, i.reason, i.hash])
              ]}
            />
            <TablePagination
              count={totalCount}
              page={page}
              perPage={perPage}
              onChangePage={setPage}
              onChangeRowsPerPage={setPerPage}
              rowsPerPageOptions={[10, 15, 20, 25]}
            />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
