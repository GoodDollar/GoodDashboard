import { useCallback, useMemo } from "react"

export const useSeriesSpecificValueFormatter = (series, formatter = null) => {
  const data = useMemo(() => series.map(({ id, data }) => ({
    id, data: data.map(({ x, y }) => ({
      x, y: { id, value: y }
    }))
  })), [series])

  const yFormat = useCallback(({ value, id }) =>
    formatter ? formatter(value, id) : value,
    [formatter]
  )

  return [data, yFormat]
}
