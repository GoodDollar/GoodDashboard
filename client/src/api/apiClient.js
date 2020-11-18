import { get } from 'lodash'
export default class ApiClient {
  constructor(http) {
    this.http = http
  }

  setToken(token) {
    this.http.setBearerToken(token)
  }

  getHealthCheck = () => this.http.get('/health-check')
  getWalletTopMedianLow = () => this.http.get('/wallets/balance/top-low-medium-avg-balance')
  getWalletTopAccounts = () => this.http.get('/wallets/balance/top-accounts')
  getWalletDistributionHistogram = () => this.http.get('/wallets/balance/distribution-histogram')
  getTransactionTopMedianLow = () => this.http.get('/wallets/transactions/top-low-medium-avg-balance')
  getTransactionTopAccounts = query => this.http.get('/wallets/transactions/top-accounts', query)
  getTransactionDistributionHistogram = () => this.http.get('/wallets/transactions/distribution-histogram')

  getTransactionTotal = () => this.http.get('/transactions/total')
  getTransactionTotalAmount = () => this.http.get('/transactions/total-amount')
  getTransactionDailyAverage = () => this.http.get('/transactions/avg-count')

  getTransactionCountPerDay = limit => this.http.get('/transactions/count-per-day', { limit })
  getTransactionUniquePerDay = limit => this.http.get('/transactions/unique-per-day', { limit })
  getTransactionAmountPerDay = limit => this.http.get('/transactions/avg-amount-per-day', { limit })
  getTransactionSumAmountPerDay = limit => this.http.get('/transactions/total-amount-per-day', { limit })
  getSupplyAmountPerDay = limit => this.http.get('/transactions/claim/supply-amount-per-day', { limit })
  getGraphQLTotalSupply = async limit => {
    const res = await this.http.post('https://api.thegraph.com/subgraphs/name/gooddollar/goodsubgraphs', {
      query: `{totalSupplyHistories(first: ${limit}, orderBy:id, orderDirection:desc) {id\ntotalSupply}}`,
    })
    const histories = get(res, 'data.totalSupplyHistories', [])
    const data = histories.map(history => {
      const day = new Date(history.id * 1000)
      const x = day.toISOString().slice(0, 10)
      const y = history.totalSupply
      return { x, y }
    })
    return { data }
  }

  getClaimPerDay = limit => this.http.get('/transactions/claim', { limit })

  // gd
  getGDTotal = () => this.http.get('/gd/total')
  getGDInEscrow = () => this.http.get('/gd/in-escrow')
  getTotalImpactStatistics = () => this.http.get('/gd/total-impact-statistics')

  getSurveyTable = query => this.http.get('/survey/total-per-day', query)
  getSurveySummaryTable = query => this.http.get('/survey/total', query)
}
