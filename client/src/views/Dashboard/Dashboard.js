import React, {useState, useEffect} from "react"
import { makeStyles } from "@material-ui/core/styles"
import CircularProgress from '@material-ui/core/CircularProgress'
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet'
// import Warning from "@material-ui/icons/Warning"
import ReceiptIcon from '@material-ui/icons/Receipt'
import EqualizerIcon from '@material-ui/icons/Equalizer'
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
import Line from "components/Charts/Line"
import Balance from "components/Balance"
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle"
import {
  useGetTransactionDailyAverage,
  useGetTransactionTotal,
  useGetTransactionTotalAmount,
  useTransactionDistributionHistogram,
  useTransactionTopAccounts,
  useTransactionTopMedianLow,
  useWalletDistributionHistogram,
  useWalletTopAccounts,
  useWalletTopMedianLow,
  useGetTransactionCountPerDay,
  useGetTransactionAmountPerDay,
  useGetTransactionSumAmountPerDay,
  useGetGDTotal,
  useGetGDInEscrow,
  useGetTransactionUniquePerDay
} from 'hooks/api'
import priceFormat from '../../utils/priceFormat'

// const dataTxLine = [
//   {
//     id: "Count of transaction",
//     data: [...Array(10)].map((v, index) => ({
//       x: `2019-11-${index + 1}`,
//       y: (Math.random() + 1) * 100,
//     })),
//   },
// ]
// const dataLine = [
//   {
//     id: "Average amount",
//     data: [...Array(10)].map((v, index) => ({
//       x: `2019-11-${index + 1}`,
//       y: (Math.random() + 1) * 100,
//     })),
//   },
//   {
//     id: "Total amount",
//     data: [...Array(10)].map((v, index) => ({
//       x: `2019-11-${index + 1}`,
//       y: (Math.random() + 1) * 100,
//     })),
//   },
// ]
const useStyles = makeStyles(styles)

const prepareHistogramData = (walletDistributionHistogram) => {
  const notNullKeys = Object.keys(walletDistributionHistogram).filter(key=>walletDistributionHistogram[key]>0)
  return notNullKeys.map((key) => {
    const label = `${key.split('-').map(v=>priceFormat(v)).join('-')} G$`
    return ({
      id: label,
      label,
      value: walletDistributionHistogram[key],
    })
  })
}

export default function Dashboard() {
  // wallet
  const [walletTopAccounts = [], walletTopAccountsLoading] = useWalletTopAccounts()
  const [walletTopMedianLow = {}, walletTopMedianLowLoading] = useWalletTopMedianLow()
  const [walletDistributionHistogram = {}, walletDistributionHistogramLoading] = useWalletDistributionHistogram()

  // transactions
  const [transactionTopAccounts = [], transactionTopAccountsLoading] = useTransactionTopAccounts()
  const [transactionTopMedianLow = {}, transactionTopMedianLowLoading] = useTransactionTopMedianLow()
  const [transactionDistributionHistogram = {}, transactionDistributionHistogramLoading] = useTransactionDistributionHistogram()
  const [transactionTotal, transactionTotalLoading] = useGetTransactionTotal()
  const [transactionTotalAmount, transactionTotalAmountLoading] = useGetTransactionTotalAmount()
  const [transactionDailyAverage, transactionDailyAverageLoading] = useGetTransactionDailyAverage()

  // per day
  const [transactionCountPerDay = [], transactionCountPerDayLoading] = useGetTransactionCountPerDay()
  const [transactionUniquePerDay = [], transactionUniquePerDayLoading] = useGetTransactionUniquePerDay()

  const [transactionAmountPerDay = [], transactionAmountPerDayLoading] = useGetTransactionAmountPerDay()
  const [transactionSumAmountPerDay = [], transactionSumAmountPerDayLoading] = useGetTransactionSumAmountPerDay()

  const [transactionAmountPerDayData, setTransactionAmountPerDayData] = useState([])
  const [transactionCountPerDayData, setTransactionCountPerDayData] = useState([])
  useEffect(() => {
    if(transactionAmountPerDay.length>0 && transactionSumAmountPerDay.length>0){
      setTransactionAmountPerDayData([
        {
          id: "Average amount",
          data: transactionAmountPerDay.map(t=>({...t,y:t.y/100})),
        },
        {
          id: "Total amount",
          data: transactionSumAmountPerDay.map(t=>({...t,y:t.y/100})),
        },
      ])
    }
  },[transactionAmountPerDay, transactionSumAmountPerDay])

  useEffect(() => {
    if(transactionCountPerDay.length>0 && transactionUniquePerDay.length>0){
      setTransactionCountPerDayData([
        {
          id: "Unique users",
          data: transactionUniquePerDay
        },
        {
          id: "Transactions",
          data: transactionCountPerDay
        },

      ])
    }
  },[transactionCountPerDay, transactionUniquePerDay])
  // gd
  const [GDTotal] = useGetGDTotal()
  const [GDInEscrow] = useGetGDInEscrow()

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
              <p className={classes.cardCategory}>General</p>
              <Success>
                Total G$:
                <Balance amount={GDTotal} fromCents/>
              </Success>
              <Success>
                G$ in OTPL:
                <Balance amount={GDInEscrow} fromCents/>
              </Success>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                OTPL - One time payment link
              </div>
            </CardFooter>
          </Card>
        </GridItem>
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
                Average: {!walletTopMedianLowLoading && (
                <Balance amount={walletTopMedianLow.avg} fromCents/>
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
                Balances of GD (top, median, average, low)
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="warning" stats icon className={classes.cardHeader}>
              <CardIcon color="warning">
                <ReceiptIcon/>
              </CardIcon>
              <p className={classes.cardCategory}>Transactions count</p>
              <Warning>
                Top: {!transactionTopMedianLowLoading && transactionTopMedianLow.top}
              </Warning>
              <Warning>
                Median: {!transactionTopMedianLowLoading && transactionTopMedianLow.median}
              </Warning>
              <Warning>
                Average: {!transactionTopMedianLowLoading && priceFormat(transactionTopMedianLow.avg)}
              </Warning>
              <Warning>
                Low: {!transactionTopMedianLowLoading && transactionTopMedianLow.low}
              </Warning>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                Transactions (top, median, average, low)
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                <EqualizerIcon/>
              </CardIcon>
              <p className={classes.cardCategory}>Transactions</p>
              <Warning>
                Total: {!transactionTotalLoading && transactionTotal}
              </Warning>
              <Warning>
                Total Amount: {!transactionTotalAmountLoading && transactionTotalAmount && <Balance amount={transactionTotalAmount}/>}
              </Warning>
              <Warning>
                Average Count: {!transactionDailyAverageLoading && transactionDailyAverage}
              </Warning>
              <Warning>
                &nbsp;
              </Warning>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                Transactions (total, total amount, average amount)
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="success">
              <h4 className={classes.cardTitleWhite}>Daily G$ usage</h4>
            </CardHeader>
            <CardBody>
              {(transactionAmountPerDayLoading || transactionSumAmountPerDayLoading) && (
                <GridItem container xs={12} justify="center">
                  <CircularProgress/>
                </GridItem>
              )}
              {!(transactionAmountPerDayLoading || transactionSumAmountPerDayLoading) && (
                <Line data={transactionAmountPerDayData} height={400} legendY={'G$'} colors={['#fb8c00','#43a047']}/>
              )}
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="warning">
              <h4 className={classes.cardTitleWhite}>Daily count of transactions</h4>
            </CardHeader>
            <CardBody>
              {(transactionCountPerDayLoading || transactionUniquePerDayLoading) && (
                <GridItem container xs={12} justify="center">
                  <CircularProgress/>
                </GridItem>
              )}
              {!(transactionCountPerDayLoading || transactionUniquePerDayLoading) && (
                <Line data={transactionCountPerDayData} height={400} legendY={'Count'} colors={['#fb8c00','#43a047']}/>
              )}
            </CardBody>
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
                    data={prepareHistogramData(walletDistributionHistogram)}
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
                      value: transactionDistributionHistogram[key],
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
                    (d, index) => [String(index + 1), d.address, `${priceFormat(d.balance/100)} G$`])}
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
