import { useCallback, useRef, useEffect } from "react"

export const useSeriesSpecificValueFormatter = (series, formatter = null) => {
  const invocationsCount = useRef(0)
  const seriesIndex = useRef(0)

  const yFormat = useCallback(value => {

    let index = seriesIndex.current
    let count = invocationsCount.current

    const seriesId = series[index].id
    const formatted = formatter ? formatter(value, seriesId) : value

    if (++count >= series[index].data.length) {
      count = 0
      if (++index >= series.length) {
        index = 0
      }
    }

    invocationsCount.current = count
    seriesIndex.current = index

    return formatted
  }, [series, formatter])

  useEffect(() => () => {
    invocationsCount.current = 0
    seriesIndex.current = 0
  }, [series, formatter])

  return yFormat
}