import { useEffect, useState } from 'react'
import api from '../api'

export const useApi = (dependencies) => {
  const [apiFunc, , params = []] = dependencies
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(undefined)
  const [error, setError] = useState(undefined)
  console.log(dependencies)
  useEffect(() => {
    setLoading(true)
    apiFunc(...params)
      .then((d) => setData(d))
      .catch((e) => setError(e))
      .then(() => setLoading(false))
  }, dependencies)

  return [
    data,
    loading,
    error
  ]
}

export const useApiHealthCheck = (deps) => useApi([api.getHealthCheck, deps])
export const useTopAccounts = deps => useApi([api.getTopAccounts, deps])
export const useTopLowMediumBalance = deps => useApi([api.getTopLowMediumBalance, deps])

