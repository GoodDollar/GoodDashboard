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
}
