const DEFAULT_QUERY_OFFSET = 1

export default (req: any) => {
  let { limit } = req.query

  // The first element in array is offset - determines how much elements skip from query
  // We are skipping the 1st record from query which is current day. The current day is still in progress so the data is not fully collected
  // By doing this we prevent drops/gap in visual graphs for users
  let result = [DEFAULT_QUERY_OFFSET]

  if (limit) {
    limit = parseInt(limit)
  }

  if (!Number.isNaN(limit) && (limit > 0)) {
    result.push(limit)
  }

  return result
}
