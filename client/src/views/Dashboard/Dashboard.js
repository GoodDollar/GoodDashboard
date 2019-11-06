import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import CircularProgress from '@material-ui/core/CircularProgress'
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet'
// import Warning from "@material-ui/icons/Warning"
import ReceiptIcon from '@material-ui/icons/Receipt';
import Warning from "components/Typography/Warning"
import Success from "components/Typography/Success"
import GridItem from "components/Grid/GridItem"
import GridContainer from "components/Grid/GridContainer"
import Table from "components/Table/Table"
import Card from "components/Card/Card"
import CardHeader from "components/Card/CardHeader"
import CardBody from "components/Card/CardBody"
import CardIcon from "components/Card/CardIcon.js"
import CardFooter from "components/Card/CardFooter.js"

import Balance from "components/Balance"
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle"
import { useWalletTopAccounts,
  useWalletTopMedianLow,
  useTransactionTopAccounts,
  useTransactionTopMedianLow } from 'hooks/api'

const useStyles = makeStyles(styles)

export default function Dashboard() {

  const [walletTopAccounts = [], walletTopAccountsLoading] = useWalletTopAccounts()
  const [walletTopMedianLow= {}, walletTopMedianLowLoading] = useWalletTopMedianLow()

  const [transactionTopAccounts = [], transactionTopAccountsLoading] = useTransactionTopAccounts()
  const [transactionTopMedianLow = {}, transactionTopMedianLowLoading] = useTransactionTopMedianLow()

  const classes = useStyles()
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <AccountBalanceWalletIcon/>
              </CardIcon>
              <p className={classes.cardCategory}>Balances</p>
              <Success>
                Top: {!walletTopMedianLowLoading && (
                <Balance amount={walletTopMedianLow.top} fromCents/>
              )}
              </Success>
              <Success>
                Median: {!walletTopMedianLowLoading && (
                <Balance amount={walletTopMedianLow.median} fromCents/>
              )}
              </Success>
              <Success>
                Low: {!walletTopMedianLowLoading && (
                <Balance amount={walletTopMedianLow.low} fromCents/>
              )}
              </Success>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                Balances of GD (top, median, low)
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                <ReceiptIcon/>
              </CardIcon>
              <p className={classes.cardCategory}>Transactions</p>
              <Warning>
                Top: {!transactionTopMedianLowLoading && transactionTopMedianLow.top}
              </Warning>
              <Warning>
                Median: {!transactionTopMedianLowLoading && transactionTopMedianLow.median}
              </Warning>
              <Warning>
                Low: {!transactionTopMedianLowLoading && transactionTopMedianLow.low}
              </Warning>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                Transactions (top, median, low)
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="success">
              <h4 className={classes.cardTitleWhite}>Top 10 Accounts (Balances)</h4>
            </CardHeader>
            <CardBody>
              {walletTopAccountsLoading && (
                <GridItem container xs={12} justify="center">
                  <CircularProgress/>
                </GridItem>
              )}
              {!walletTopAccountsLoading && walletTopAccounts && (
                <Table
                  tableHeaderColor="success"
                  tableHead={["#", "Address", "Balance"]}
                  tableData={walletTopAccounts.map(
                    (d, index) => [String(index + 1), d.address, <Balance amount={d.balance} fromCents/>])}
                />
              )}
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="warning">
              <h4 className={classes.cardTitleWhite}>Top 10 Accounts (Transactions)</h4>
            </CardHeader>
            <CardBody>
              {transactionTopAccountsLoading && (
                <GridItem container xs={12} justify="center">
                  <CircularProgress/>
                </GridItem>
              )}
              {!transactionTopAccountsLoading && transactionTopAccounts && (
                <Table
                  tableHeaderColor="warning"
                  tableHead={["#", "Address", "Count"]}
                  tableData={transactionTopAccounts.map(
                    (d, index) => [String(index + 1), d.address, String(d.balance)])}
                />
              )}
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  )
}
