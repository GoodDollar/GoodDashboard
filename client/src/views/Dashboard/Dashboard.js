import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import CircularProgress from '@material-ui/core/CircularProgress'
import GridItem from "components/Grid/GridItem.js"
import GridContainer from "components/Grid/GridContainer.js"
import Table from "components/Table/Table.js"
import Card from "components/Card/Card.js"
import CardHeader from "components/Card/CardHeader.js"
import CardBody from "components/Card/CardBody.js"
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js"
import { useTopAccounts, useTopLowMediumBalance } from 'hooks/api'

const useStyles = makeStyles(styles)

export default function Dashboard() {

  const [topAccounts = [], topAccountsLoading] = useTopAccounts()
  const [topLowMediumBalance, topLowMediumBalanceLoading] = useTopLowMediumBalance()
  let topLowMediumBalanceTableData = [[]]
  if (topLowMediumBalance && topLowMediumBalance.top) {
    topLowMediumBalanceTableData = [
      [
        String(topLowMediumBalance.top),
        String(topLowMediumBalance.median),
        String(topLowMediumBalance.low)
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
                  tableData={topAccounts.map((d, index) => [String(index + 1), d.address, String(d.balance)])}
                />
              )}
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  )
}
