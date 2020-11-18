import ApiError from './apiError'

export default class HttpAdapter {
  constructor(axiosInstance) {
    this.axiosInstance = axiosInstance
    this.axiosInstance.defaults.headers = {
      ...this.axiosInstance.defaults.headers,
      //this break thegraph api
      // 'Cache-Control': 'no-cache, no-store'
    }
  }

  async processResponse(promise, path) {
    try {
      const { data } = await promise
      return data
    } catch (e) {
      throw new ApiError(e, path)
    }
  }

  get axios() {
    return this.axiosInstance
  }

  setBearerToken(token) {
    if (!token) {
      delete this.axiosInstance.defaults.headers['Authorization']
    } else {
      this.axiosInstance.defaults.headers = {
        ...this.axiosInstance.defaults.headers,
        Authorization: `Bearer ${token}`,
      }
    }
  }

  delete(path, config) {
    return this.processResponse(this.axios.delete(path, config), path)
  }

  get(path, params, config) {
    return this.processResponse(this.axios.get(path, { ...config, params }), path)
  }

  patch(path, data, config) {
    return this.processResponse(this.axios.patch(path, data, config), path)
  }

  post(path, data, config) {
    return this.processResponse(this.axios.post(path, data, config), path)
  }

  put(path, data, config) {
    return this.processResponse(this.axios.put(path, data, config), path)
  }
}
