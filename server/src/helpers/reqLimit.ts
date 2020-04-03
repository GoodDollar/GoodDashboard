export default (req: any) => {
  let { limit } = req.query
  let result = [0]

  if (limit) {
    limit = parseInt(limit)
  }

  if (!Number.isNaN(limit) && (limit > 0)) {
    result.push(limit)
  }

  return result
}
