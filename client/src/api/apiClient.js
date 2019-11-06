export default class ApiClient {
  constructor(http) {
    this.http = http
  }

  setToken(token) {
    this.http.setBearerToken(token)
  }

  getHealthCheck = () => this.http.get('/health-check')
  getWalletTopMedianLow = () => this.http.get('/balance/get-top-low-medium-balance')
  getWalletTopAccounts = () => this.http.get('/balance/get-top-accounts')
  getTransactionTopMedianLow = () => this.http.get('/balance/get-top-low-medium-balance')
  getTransactionTopAccounts = () => this.http.get('/balance/get-top-accounts')

}
