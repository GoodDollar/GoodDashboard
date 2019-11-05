import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import CircularProgress from '@material-ui/core/CircularProgress'
import GridItem from "components/Grid/GridItem"
import GridContainer from "components/Grid/GridContainer"
import Table from "components/Table/Table"
import Card from "components/Card/Card"
import CardHeader from "components/Card/CardHeader"
import CardBody from "components/Card/CardBody"
import Balance from "components/Balance"
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle"
import { useTopAccounts, useTopLowMediumBalance } from 'hooks/api'

const useStyles = makeStyles(styles)

export default function Dashboard() {

  const [topAccounts = [], topAccountsLoading] = useTopAccounts()
  const [topLowMediumBalance, topLowMediumBalanceLoading] = useTopLowMediumBalance()
  let topLowMediumBalanceTableData = [[]]
  if (topLowMediumBalance && topLowMediumBalance.top) {
    topLowMediumBalanceTableData = [
      [
        <Balance amount={topLowMediumBalance.top} fromCents/>,
        <Balance amount={topLowMediumBalance.median} fromCents/>,
        <Balance amount={topLowMediumBalance.low} fromCents/>
      ]]
  }
  const classes = useStyles()
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Top/Medium/Low Balances</h4>
            </CardHeader>
            <CardBody>
              {topLowMediumBalanceLoading && (
                <GridItem container xs={12} justify="center">
                  <CircularProgress/>
                </GridItem>
              )}
              {!topLowMediumBalanceLoading && topLowMediumBalance && (
                <Table
                  tableHeaderColor="primary"
                  tableHead={["Top", "Median", "Low"]}
                  tableData={topLowMediumBalanceTableData}
                />
              )}
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="warning">
              <h4 className={classes.cardTitleWhite}>Top 10 Accounts</h4>
            </CardHeader>
            <CardBody>
              {topAccountsLoading && (
                <GridItem container xs={12} justify="center">
                  <CircularProgress/>
                </GridItem>
              )}
              {!topAccountsLoading && topAccounts && (
                <Table
                  tableHeaderColor="warning"
                  tableHead={["#", "Address", "Balance"]}
                  tableData={topAccounts.map(
                    (d, index) => [String(index + 1), d.address, <Balance amount={d.balance} fromCents/>])}
                />
              )}
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  )
}
