import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import CircularProgress from '@material-ui/core/CircularProgress'
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet'
// import Warning from "@material-ui/icons/Warning"
import ReceiptIcon from '@material-ui/icons/Receipt'
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
import Pie from "components/Charts/Pie"

import Balance from "components/Balance"
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle"
import {
  useTransactionDistributionHistogram,
  useTransactionTopAccounts,
  useTransactionTopMedianLow,
  useWalletDistributionHistogram,
  useWalletTopAccounts,
  useWalletTopMedianLow
} from 'hooks/api'

const useStyles = makeStyles(styles)

export default function Dashboard() {

  const [walletTopAccounts = [], walletTopAccountsLoading] = useWalletTopAccounts()
  const [walletTopMedianLow = {}, walletTopMedianLowLoading] = useWalletTopMedianLow()
  const [walletDistributionHistogram = {}, walletDistributionHistogramLoading] = useWalletDistributionHistogram()

  const [transactionTopAccounts = [], transactionTopAccountsLoading] = useTransactionTopAccounts()
  const [transactionTopMedianLow = {}, transactionTopMedianLowLoading] = useTransactionTopMedianLow()
  const [transactionDistributionHistogram = {}, transactionDistributionHistogramLoading] = useTransactionDistributionHistogram()
  /*
   color: "hsl(151, 70%, 50%)"
   id: "haskell"
   label: "haskell"
   value: 64
   */
  console.log({ walletDistributionHistogram, transactionDistributionHistogram })
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
              <h4 className={classes.cardTitleWhite}>Distributions (Balances)</h4>
            </CardHeader>
            <CardBody>
              <GridItem container xs={12} justify="center">
                {walletDistributionHistogramLoading && (
                  <CircularProgress/>
                )}
                {!walletDistributionHistogramLoading && (
                  <Pie
                    data={Object.keys(walletDistributionHistogram).map((key) => ({
                      id: key,
                      label: key,
                      value: walletDistributionHistogram[key]
                    }))}
                  />
                )}
              </GridItem>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="warning">
              <h4 className={classes.cardTitleWhite}>Distributions (Transactions)</h4>
            </CardHeader>
            <CardBody>
              <GridItem container xs={12} justify="center">
                {transactionDistributionHistogramLoading && (
                  <CircularProgress/>
                )}
                {!transactionDistributionHistogramLoading && (
                  <Pie
                    data={Object.keys(transactionDistributionHistogram).map((key) => ({
                      id: key,
                      label: key,
                      value: transactionDistributionHistogram[key]
                    }))}
                  />
                )}
              </GridItem>
            </CardBody>
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
                    (d, index) => [String(index + 1), d.address, String(d.countTx)])}
                />
              )}
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  )
}
