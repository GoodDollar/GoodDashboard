import { useEffect, useState } from 'react'
import api from '../api'

export const useApi = (apiFunc, deps, params = []) => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(undefined)
  const [error, setError] = useState(undefined)
  useEffect(() => {
    setLoading(true)
    apiFunc(...params)
      .then((d) => setData(d && d.data))
      .catch((e) => setError(e))
      .then(() => setLoading(false))
    // eslint-disable-next-line
  }, deps)
  return [
    data,
    loading,
    error
  ]
}

export const useApiHealthCheck = (deps = []) => useApi(api.getHealthCheck, deps)

// wallets
export const useWalletTopAccounts = (deps = []) => useApi(api.getWalletTopAccounts, deps)
export const useWalletTopMedianLow = (deps = []) => useApi(api.getWalletTopMedianLow, deps)
export const useWalletDistributionHistogram = (deps = []) => useApi(api.getWalletDistributionHistogram, deps)

// transactions
export const useTransactionTopAccounts = (deps = []) => useApi(api.getTransactionTopAccounts, deps)
export const useTransactionTopMedianLow = (deps = []) => useApi(api.getTransactionTopMedianLow, deps)
export const useTransactionDistributionHistogram = (deps = []) => useApi(api.getTransactionDistributionHistogram, deps)
export const useGetTransactionTotal = (deps = []) => useApi(api.getTransactionTotal, deps)
export const useGetTransactionTotalAmount = (deps = []) => useApi(api.getTransactionTotalAmount, deps)
export const useGetTransactionDailyAverage = (deps = []) => useApi(api.getTransactionDailyAverage, deps)

// per day
export const useGetTransactionCountPerDay = (deps=[], ...params) => useApi(api.getTransactionCountPerDay, deps, params)
export const useGetTransactionUniquePerDay = (deps=[], ...params) => useApi(api.getTransactionUniquePerDay, deps, params)
export const useGetTransactionAmountPerDay = (deps=[], ...params) => useApi(api.getTransactionAmountPerDay, deps, params)
export const useGetTransactionSumAmountPerDay = (deps=[], ...params) => useApi(api.getTransactionSumAmountPerDay, deps, params)
export const useGetClaimPerDay = (deps=[], ...params) => useApi(api.getClaimPerDay, deps, params)

// gd
export const useGetGDTotal = (deps=[]) => useApi(api.getGDTotal, deps)
export const useGetGDInEscrow = (deps=[]) => useApi(api.getGDInEscrow, deps)

// survey
export const useGetSurveyTable = (deps=[], params) => useApi(api.getSurveyTable, deps, params)
export const useGetSurveySummaryTable = (deps=[], params) => useApi(api.getSurveySummaryTable, deps, params)
