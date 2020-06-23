import React, { useCallback, useEffect, useState} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet'
// import DataUsageIcon from "@material-ui/icons/DataUsage"
import ReceiptIcon from '@material-ui/icons/Receipt'
import EqualizerIcon from '@material-ui/icons/Equalizer'
import Warning from 'components/Typography/Warning'
import Info from 'components/Typography/Info'
import Success from 'components/Typography/Success'
// import Primary from 'components/Typography/Primary'
import GridItem from 'components/Grid/GridItem'
import GridContainer from 'components/Grid/GridContainer'
import Table from 'components/Table/Table'
import SortTitle from 'components/Table/SortTitle'
import Card from 'components/Card/Card'
import CardHeader from 'components/Card/CardHeader'
import CardBody from 'components/Card/CardBody'
import CardIcon from 'components/Card/CardIcon.js'
import CardFooter from 'components/Card/CardFooter.js'
import Pie from 'components/Charts/Pie'
import Line from 'components/Charts/Line'
import Balance from 'components/Balance'
import styles from 'assets/jss/material-dashboard-react/views/dashboardStyle'
import {
  // useGetGDInEscrow,
  // useGetGDTotal,
  useGetTotalImpactStatistics,
  useGetTransactionAmountPerDay,
  useGetTransactionCountPerDay,
  useGetTransactionDailyAverage,
  useGetTransactionSumAmountPerDay,
  useGetSupplyAmountPerDay,
  useGetTransactionTotal,
  useGetTransactionTotalAmount,
  useGetTransactionUniquePerDay,
  useTransactionDistributionHistogram,
  useTransactionTopAccounts,
  useTransactionTopMedianLow,
  useWalletDistributionHistogram,
  useWalletTopAccounts,
  useWalletTopMedianLow,
  useGetClaimPerDay
} from 'hooks/api'
import priceFormat from '../../utils/priceFormat'
import isMobileOnly from '../../utils/isMobile'
import TooltipUserInfo from '../UserProfile/TooltipUserInfo'
import { useSeriesSpecificValueFormatter } from '../../hooks/nivo'
import config from "../../config";

const useStyles = makeStyles(styles)

const prepareHistogramBalanceData = histogram => Object.keys(histogram).map((key) => {
  const label = `${key.split('-').map(v => priceFormat(v / 100,0)).join('-')} G$`
  return ({
    id: label,
    label,
    value: histogram[key],
  })
})

const prepareHistogramTransactionData = histogram => Object.keys(histogram).map((key) => ({
  id: key,
  label: key,
  value: histogram[key],
}))

// chart configs for mobile devices
const lineChartDataLimiter = isMobileOnly ? 10 : 20
const lineChartTickRotation = isMobileOnly ? -90 : 0
const mobilePieChartProps = !isMobileOnly ? {} : {
  width: 500,
  height: 275,
  radialLabelsLinkDiagonalLength: 7,
  radialLabelsLinkHorizontalLength: 10,
  radialLabelsTextXOffset: 4,
}
const mobileLineChartProps = !isMobileOnly ? {} : {
  lineWidth: 1.5,
  pointSize: 8,
  theme: {
    axis: {
      ticks: {
        text: {
          fontSize: 10,
        },
      },
    },
  }
}

export default function Dashboard() {
  // wallet
  const [walletTopAccounts = [], walletTopAccountsLoading] = useWalletTopAccounts()
  const [walletTopMedianLow = {}, walletTopMedianLowLoading] = useWalletTopMedianLow()
  const [walletDistributionHistogram = {}, walletDistributionHistogramLoading] = useWalletDistributionHistogram()

  const [transactionSort, setTransactionSort] = useState('countTx')
  const [transactionSortDirection, setTransactionSortDirection] = useState('desc')
  // transactions
  const [transactionTopAccounts = [], transactionTopAccountsLoading] = useTransactionTopAccounts(
    [transactionSort, transactionSortDirection],
    {transactionSort, transactionSortDirection}
  )
  const [transactionTopMedianLow = {}, transactionTopMedianLowLoading] = useTransactionTopMedianLow()
  const [transactionDistributionHistogram = {}, transactionDistributionHistogramLoading] = useTransactionDistributionHistogram()
  const [transactionTotal, transactionTotalLoading] = useGetTransactionTotal()
  const [transactionTotalAmount, transactionTotalAmountLoading] = useGetTransactionTotalAmount()
  const [transactionDailyAverage, transactionDailyAverageLoading] = useGetTransactionDailyAverage()

  // per day
  const [transactionCountPerDay = [], transactionCountPerDayLoading] = useGetTransactionCountPerDay([], lineChartDataLimiter)
  const [transactionUniquePerDay = [], transactionUniquePerDayLoading] = useGetTransactionUniquePerDay([], lineChartDataLimiter)

  const [claimPerDay = [], claimPerDayLoading] = useGetClaimPerDay([], 20)
  const [transactionAmountPerDay = [], transactionAmountPerDayLoading] = useGetTransactionAmountPerDay([], lineChartDataLimiter)
  const [transactionSumAmountPerDay = [], transactionSumAmountPerDayLoading] = useGetTransactionSumAmountPerDay([], lineChartDataLimiter)
  const [supplyAmountPerDay = [], supplyAmountPerDayLoading] = useGetSupplyAmountPerDay([], lineChartDataLimiter)

  const [supplyAmountPerDayData, setSupplyAmountPerDayData] = useState([])
  const [transactionAmountPerDayData, setTransactionAmountPerDayData] = useState([])
  const [transactionCountPerDayData, setTransactionCountPerDayData] = useState([])
  const [claimPerDayData, setClaimPerDayData] = useState([])

  useEffect(() => {
    if (supplyAmountPerDay.length > 0) {
      setSupplyAmountPerDayData([
        {
          id: 'Total G$ Supply',
          data: supplyAmountPerDay.map(t => ({ ...t, y: t.y / 100 })),
        },
      ])
    }
  }, [supplyAmountPerDay])

  useEffect(() => {
    if (transactionAmountPerDay.length > 0 && transactionSumAmountPerDay.length > 0) {
      setTransactionAmountPerDayData([
        {
          id: 'Average amount',
          data: transactionAmountPerDay.map(t => ({ ...t, y: t.y / 100 })),
        },
        {
          id: 'Total amount',
          data: transactionSumAmountPerDay.map(t => ({ ...t, y: t.y / 100 })),
        },
      ])
    }
  }, [transactionAmountPerDay, transactionSumAmountPerDay])

  useEffect(() => {
    if (transactionCountPerDay.length > 0 && transactionUniquePerDay.length > 0) {
      setTransactionCountPerDayData([
        {
          id: 'Unique users',
          data: transactionUniquePerDay,
        },
        {
          id: 'Total claimers',
          data: transactionCountPerDay,
        },

      ])
    }
  }, [transactionCountPerDay, transactionUniquePerDay])

  useEffect(() => {
    if (claimPerDay.length > 0) {
      setClaimPerDayData([
        {
          id: 'Transactions',
          data: claimPerDay.map(v=>({
            x: v.date,
            y: v.count_txs
          })),
        },
        {
          id: 'Total amount',
          data: claimPerDay.map(v=>({
            x: v.date,
            y: v.total_amount_txs/100
          })),
        },

      ])
    }
  }, [claimPerDay])

  // gd
  // const [GDTotal] = useGetGDTotal()
  // const [GDInEscrow] = useGetGDInEscrow()
  const [
    {
      totalUniqueClaimers,
      totalUBIDistributed,
      totalGDVolume,
    } = {},
    totalImpactStatisticsLoading,
  ] = useGetTotalImpactStatistics()

  const classes = useStyles()

  const handleSortTransaction = (field, direction) => {
    setTransactionSort(field)
    setTransactionSortDirection(direction)
  }

  const claimPerDayFormatter = useSeriesSpecificValueFormatter(
    claimPerDayData, (value, seriesId) => {
      switch (seriesId) {
        case 'Transactions':
          return value
        case 'Total amount':
          return `G$ ${priceFormat(value)}`
        default:
          throw new Error(`Unknown series '${seriesId}'`)
      }
    }
  )

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} md={6} lg={3}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                <AccountBalanceWalletIcon/>
              </CardIcon>
              <p className={classes.cardCategory}>Total Unique Claimers</p>
              <Warning>
                Value: {!totalImpactStatisticsLoading && totalUniqueClaimers}
              </Warning>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                Total Unique Claimers
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} md={6} lg={3}>
          <Card>
            <CardHeader color="info" stats icon className={classes.cardHeader}>
              <CardIcon color="info">
                <ReceiptIcon/>
              </CardIcon>
              <p className={classes.cardCategory}>Total UBI Distributed</p>
              <Info>
                Value: {!totalImpactStatisticsLoading && <Balance amount={totalUBIDistributed} fromCents />}
              </Info>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                Total UBI Distributed
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} md={6} lg={3}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <EqualizerIcon/>
              </CardIcon>
              <p className={classes.cardCategory}>Total G$ Volume</p>
              <Success>
                Value: {!totalImpactStatisticsLoading && <Balance amount={totalGDVolume} fromCents />}
              </Success>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                Total G$ Volume
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} lg={12} xl={6}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Google Data Studio</h4>
            </CardHeader>
            <CardBody className={classes.googleMapCardBody}>
              <iframe
                width="100%"
                src={config.embedDataStudioUrl}
                frameBorder="0"
                style={{
                  border: 0,
                  height: '100%',
                  width: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
                allowFullScreen
              />
            </CardBody>
            <CardFooter stats>
              <div className={classes.stats}>
                Google Data Studio
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} lg={12} xl={6}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Daily G$ Claim</h4>
            </CardHeader>
            <CardBody>
              {(claimPerDayLoading) && (
                <GridItem container xs={12} justify="center">
                  <CircularProgress/>
                </GridItem>
              )}
              {!claimPerDayLoading && (
                <Line
                  data={claimPerDayData}
                  height={400}
                  xScale={{
                    type: 'time',
                    format: '%Y-%m-%d',
                    precision: 'day',
                  }}
                  axisBottom={{
                    format: '%b %d',
                    tickValues: 'every 5 days',
                    legendOffset: -12,
                  }}
                  xFormat="time:%Y-%m-%d"
                  yFormat={claimPerDayFormatter}
                  {...mobileLineChartProps}
                />
              )}
            </CardBody>
            <CardFooter stats>
              <div className={classes.stats}>
                Chart shows total volume and number of claim transactions per day
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} lg={12} xl={4}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Total G$ supply</h4>
            </CardHeader>
            <CardBody>
              {(supplyAmountPerDayLoading) && (
                <GridItem container xs={12} justify="center">
                  <CircularProgress/>
                </GridItem>
              )}
              {!supplyAmountPerDayLoading && (
                <Line
                  data={supplyAmountPerDayData}
                  height={400}
                  xScale={{
                    type: 'time',
                    format: '%Y-%m-%d',
                    precision: 'day',
                  }}
                  axisBottom={{
                    format: '%b %d',
                    tickValues: 'every 5 days',
                    legendOffset: -12,
                  }}
                  xFormat="time:%Y-%m-%d"
                  yFormat={v => `G$ ${priceFormat(v)}`}
                  {...mobileLineChartProps}
                />
              )}
            </CardBody>
            <CardFooter stats>
              <div className={classes.stats}>
                Chart shows total G$ supply per day
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} lg={6} xl={4}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Daily G$ Usage</h4>
            </CardHeader>
            <CardBody>
              {(transactionAmountPerDayLoading || transactionSumAmountPerDayLoading) && (
                <GridItem container xs={12} justify="center">
                  <CircularProgress/>
                </GridItem>
              )}
              {!(transactionAmountPerDayLoading || transactionSumAmountPerDayLoading) && (
                <Line
                  data={transactionAmountPerDayData}
                  height={400}
                  xScale={{
                    type: 'time',
                    format: '%Y-%m-%d',
                    precision: 'day',
                  }}
                  axisBottom={{
                    format: '%b %d',
                    tickValues: 'every 5 days',
                    tickRotation: lineChartTickRotation,
                    legendOffset: -12,
                  }}
                  xFormat="time:%Y-%m-%d"
                  yFormat={v => `G$ ${priceFormat(v)}`}
                  {...mobileLineChartProps}
                />
              )}
            </CardBody>
            <CardFooter stats>
              <div className={classes.stats}>
                Chart shows total volume and average amount of transactions per day
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} lg={6} xl={4}>
          <Card>
            <CardHeader color="success">
              <h4 className={classes.cardTitleWhite}>Daily Count Of Transactions</h4>
            </CardHeader>
            <CardBody>
              {(transactionCountPerDayLoading || transactionUniquePerDayLoading) && (
                <GridItem container xs={12} justify="center">
                  <CircularProgress/>
                </GridItem>
              )}
              {!(transactionCountPerDayLoading || transactionUniquePerDayLoading) && (
                <Line
                  data={transactionCountPerDayData}
                  height={400}
                  xScale={{
                    type: 'time',
                    format: '%Y-%m-%d',
                    precision: 'day',
                  }}
                  axisBottom={{
                    format: '%b %d',
                    tickValues: 'every 5 days',
                    tickRotation: lineChartTickRotation,
                    legendOffset: -12,
                  }}
                  xFormat="time:%Y-%m-%d"
                  {...mobileLineChartProps}
                />
              )}
            </CardBody>
            <CardFooter stats>
              <div className={classes.stats}>
                Chart shows number of transactions and number of unique users per day
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        {/*<GridItem xs={12} md={6} lg={3}>
          <Card>
            <CardHeader color="primary" stats icon>
              <CardIcon color="primary">
                <DataUsageIcon/>
              </CardIcon>
              <p className={classes.cardCategory}>General</p>
              <Primary>
                GD in circulation: <Balance amount={GDTotal} fromCents/>
              </Primary>
              <Primary>
                GD held in escrow: <Balance amount={GDInEscrow} fromCents/>
              </Primary>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                GD in circulation, GD held in escrow
              </div>
            </CardFooter>
          </Card>
        </GridItem>*/}
        <GridItem xs={12} md={6} lg={3}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                <AccountBalanceWalletIcon/>
              </CardIcon>
              <p className={classes.cardCategory}>User Accounts Balance</p>
              <Warning>
                Top: {!walletTopMedianLowLoading && (
                <Balance amount={walletTopMedianLow.top} fromCents/>
              )}
              </Warning>
              <Warning>
                Median: {!walletTopMedianLowLoading && (
                <Balance amount={walletTopMedianLow.median} fromCents/>
              )}
              </Warning>
              <Warning>
                Average: {!walletTopMedianLowLoading && (
                <Balance amount={walletTopMedianLow.avg} fromCents/>
              )}
              </Warning>
              <Warning>
                Low: {!walletTopMedianLowLoading && (
                <Balance amount={walletTopMedianLow.low} fromCents/>
              )}
              </Warning>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                User Accounts Balance (top, median, average, low)
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} md={6} lg={3}>
          <Card>
            <CardHeader color="info" stats icon className={classes.cardHeader}>
              <CardIcon color="info">
                <ReceiptIcon/>
              </CardIcon>
              <p className={classes.cardCategory}>User Transactions</p>
              <Info>
                Top: {!transactionTopMedianLowLoading && transactionTopMedianLow.top}
              </Info>
              <Info>
                Median: {!transactionTopMedianLowLoading && transactionTopMedianLow.median}
              </Info>
              <Info>
                Average: {!transactionTopMedianLowLoading && priceFormat(transactionTopMedianLow.avg)}
              </Info>
              <Info>
                Low: {!transactionTopMedianLowLoading && transactionTopMedianLow.low}
              </Info>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                User Transactions (top, median, average, low)
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} md={6} lg={3}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <EqualizerIcon/>
              </CardIcon>
              <p className={classes.cardCategory}>Transactions</p>
              <Success>
                Total: {!transactionTotalLoading && transactionTotal}
              </Success>
              <Success>
                Total Amount: {!transactionTotalAmountLoading && transactionTotalAmount &&
              <Balance amount={transactionTotalAmount} fromCents/>}
              </Success>
              <Success>
                Average Daily TXs: {!transactionDailyAverageLoading && transactionDailyAverage &&
              priceFormat(transactionDailyAverage)}
              </Success>
              <Success>
                &nbsp;
              </Success>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                Transactions (total, total amount, Average Daily TXs)
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} lg={6}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Distributions (Balances)</h4>
            </CardHeader>
            <CardBody>
              <GridItem container xs={12} justify="center">
                {walletDistributionHistogramLoading && (
                  <CircularProgress/>
                )}
                {!walletDistributionHistogramLoading && (
                  <Pie
                    data={prepareHistogramBalanceData(walletDistributionHistogram)}
                    {...mobilePieChartProps}
                  />
                )}
              </GridItem>
            </CardBody>
            <CardFooter stats>
              <div className={classes.stats}>
                The diagram shows how many users have a specific range of balance
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} lg={6}>
          <Card>
            <CardHeader color="success">
              <h4 className={classes.cardTitleWhite}>Distributions (Transactions)</h4>
            </CardHeader>
            <CardBody>
              <GridItem container xs={12} justify="center">
                {transactionDistributionHistogramLoading && (
                  <CircularProgress/>
                )}
                {!transactionDistributionHistogramLoading && (
                  <Pie
                    data={prepareHistogramTransactionData(transactionDistributionHistogram)}
                    {...mobilePieChartProps}
                  />
                )}
              </GridItem>
            </CardBody>
            <CardFooter stats>
              <div className={classes.stats}>
                The diagram shows how many users did a specific range of transactions
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12} lg={12} xl={6}>
          <Card>
            <CardHeader color="primary">
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
                  tableHeaderColor="primary"
                  tableHead={['#', 'Address', 'Balance']}
                  lastColumnClass={'tableCellRight'}
                  tableData={walletTopAccounts.map(
                    (d, index) => [String(index + 1), (<TooltipUserInfo hash={d.address}/>), `${priceFormat(d.balance / 100)} G$`])}
                />
              )}
            </CardBody>
            <CardFooter stats>
              <div className={classes.stats}>
                Top 10 User accounts by balances
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={12} lg={12} xl={6}>
          <Card>
            <CardHeader color="success">
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
                  tableHeaderColor="success"
                  tableHead={[
                    '#',
                    'Address',
                    (<SortTitle title={"In"} onPress={handleSortTransaction}
                                sortFieldNow={transactionSort} direction={transactionSortDirection} field={"inTXs"} />),
                    (<SortTitle title={"Out"} onPress={handleSortTransaction}
                                sortFieldNow={transactionSort} direction={transactionSortDirection} field={"outTXs"} />),
                    (<SortTitle title={"Count"} onPress={handleSortTransaction}
                                sortFieldNow={transactionSort} direction={transactionSortDirection} field={"countTx"} />)]
                  }
                  lastColumnClass={'tableCellRight'}
                  tableData={transactionTopAccounts.map(
                    (d, index) => [String(index + 1), (<TooltipUserInfo hash={d.address}/>), d.inTXs ? String(d.inTXs) : 0, d.outTXs ? String(d.outTXs) : 0, String(d.countTx)])}
                />
              )}
            </CardBody>
            <CardFooter stats>
              <div className={classes.stats}>
                Top 10 User accounts by number of transactions
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  )
}
