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
  getTransactionTopAccounts = () => this.http.get('/wallets/transactions/top-accounts')
  getTransactionDistributionHistogram = () => this.http.get('/wallets/transactions/distribution-histogram')

  getTransactionTotal = () => this.http.get('/transactions/total')
  getTransactionTotalAmount = () => this.http.get('/transactions/total-amount')
  getTransactionDailyAverage = () => this.http.get('/transactions/avg-count')

  getTransactionCountPerDay = () => this.http.get('/transactions/count-per-day')
  getTransactionUniquePerDay = () => this.http.get('/transactions/unique-per-day')
  getTransactionAmountPerDay = () => this.http.get('/transactions/avg-amount-per-day')
  getTransactionSumAmountPerDay = () => this.http.get('/transactions/total-amount-per-day')

  getGDTotal = () => this.http.get('/gd/total')
  getGDInEscrow = () => this.http.get('/gd/in-escrow')

  getSurveyTable = (query) => this.http.get('/survey/total-per-day', query)
  getSurveySummaryTable = (query) => this.http.get('/survey/total', query)
}
