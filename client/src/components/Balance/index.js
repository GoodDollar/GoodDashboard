import React from 'react' // eslint-disable-line no-unused-vars
import { CURRENCY_GD } from '../../constants'
import priceFormat from '../../utils/priceFormat'

const CURRENCIES = {
  [CURRENCY_GD]: 'GD'
}

export default (
  { amount, currency = CURRENCY_GD, decimalCount, decimal, thousands, fromCents }) => {
  amount = amount || 0
  if (fromCents) {
    amount = amount / 100
  }
  return (
    <span>
      {priceFormat(amount, decimalCount, decimal, thousands)}
      {CURRENCIES[currency] && (
        <span> {CURRENCIES[currency]}</span>
      )}
  </span>
  )
}
