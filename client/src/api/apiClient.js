export default class ApiClient {
  constructor(http) {
    this.http = http
  }

  setToken(token) {
    this.http.setBearerToken(token)
  }

  getHealthCheck = () => this.http.get('/health-check')
  getWalletTopMedianLow = () => this.http.get('/wallets/balance/get-top-low-medium-balance')
  getWalletTopAccounts = () => this.http.get('/wallets/balance/get-top-accounts')
  getWalletDistributionHistogram = () => this.http.get('/wallets/balance/get-distribution-histogram')
  getTransactionTopMedianLow = () => this.http.get('/wallets/transactions/get-top-low-medium-balance')
  getTransactionTopAccounts = () => this.http.get('/wallets/transactions/get-top-accounts')
  getTransactionDistributionHistogram = () => this.http.get('/wallets/transactions/get-distribution-histogram')
}
