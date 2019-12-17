import React from 'react' // eslint-disable-line no-unused-vars
import { CURRENCY_GD } from '../../constants'
import priceFormat from '../../utils/priceFormat'
import { makeStyles } from '@material-ui/core/styles'

const CURRENCIES = {
  [CURRENCY_GD]: 'G$'
}
const styles = theme => ({
  balance:{whiteSpace:'nowrap'}
})
const useStyles = makeStyles(styles);
export default (
  { amount, currency = CURRENCY_GD, decimalCount, decimal, thousands, fromCents }) => {
  amount = amount || 0
  if (fromCents) {
    amount = amount / 100
  }
  const classes = useStyles()
  return (
    <span className={classes.balance}>
      {priceFormat(amount, decimalCount, decimal, thousands)}
      {CURRENCIES[currency] && (
        <span> {CURRENCIES[currency]}</span>
      )}
  </span>
  )
}
