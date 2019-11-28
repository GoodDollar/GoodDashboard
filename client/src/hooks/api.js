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
export const useWalletTopAccounts = (deps = []) => useApi(api.getWalletTopAccounts, deps)
export const useWalletTopMedianLow = (deps = []) => useApi(api.getWalletTopMedianLow, deps)
export const useWalletDistributionHistogram = (deps = []) => useApi(api.getWalletDistributionHistogram, deps)
export const useTransactionTopAccounts = (deps = []) => useApi(api.getTransactionTopAccounts, deps)
export const useTransactionTopMedianLow = (deps = []) => useApi(api.getTransactionTopMedianLow, deps)
export const useTransactionDistributionHistogram = (deps = []) => useApi(api.getTransactionDistributionHistogram, deps)
export const useGetTransactionTotal = (deps = []) => useApi(api.getTransactionTotal, deps)
export const useGetTransactionTotalAmount = (deps = []) => useApi(api.getTransactionTotalAmount, deps)
export const useGetTransactionDailyAverage = (deps = []) => useApi(api.getTransactionDailyAverage, deps)
