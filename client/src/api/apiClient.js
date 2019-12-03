export default class ApiClient {
  constructor(http) {
    this.http = http
  }

  setToken(token) {
    this.http.setBearerToken(token)
  }

  getHealthCheck = () => this.http.get('/health-check')
  getWalletTopMedianLow = () => this.http.get('/wallets/balance/top-low-medium-avr-balance')
  getWalletTopAccounts = () => this.http.get('/wallets/balance/top-accounts')
  getWalletDistributionHistogram = () => this.http.get('/wallets/balance/distribution-histogram')
  getTransactionTopMedianLow = () => this.http.get('/wallets/transactions/top-low-medium-avr-balance')
  getTransactionTopAccounts = () => this.http.get('/wallets/transactions/top-accounts')
  getTransactionDistributionHistogram = () => this.http.get('/wallets/transactions/distribution-histogram')
  getTransactionTotal = () => this.http.get('/transactions/total')
  getTransactionTotalAmount = () => this.http.get('/transactions/total-amount')
  getTransactionDailyAverage = () => this.http.get('/transactions/avg-amount')

  getTransactionCountPerDay = () => this.http.get('/transactions/count-per-day')
  getTransactionAmountPerDay = () => this.http.get('/transactions/amount-per-day')
  getTransactionSumAmountPerDay = () => this.http.get('/transactions/sum-amount-per-day')

  getGDTotal = () => this.http.get('/gd/total')
  getGDInEscrow = () => this.http.get('/gd/in-escrow')
}
