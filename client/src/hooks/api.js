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
export const useTopAccounts = (deps = []) => useApi(api.getTopAccounts, deps)
export const useTopLowMediumBalance = (deps = []) => useApi(api.getTopLowMediumBalance, deps)

