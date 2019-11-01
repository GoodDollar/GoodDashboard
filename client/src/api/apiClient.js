export default class ApiClient {
  constructor(http) {
    this.http = http
  }

  setToken(token) {
    this.http.setBearerToken(token)
  }

  getHealthCheck = () => this.http.get('/health-check')
  getTopLowMediumBalance = () => this.http.get('/balance/get-top-low-medium-balance')
  getTopAccounts = () => this.http.get('/balance/get-top-accounts')

}
