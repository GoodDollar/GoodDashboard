import axios from 'axios'
import ApiClient from './apiClient'
import HttpAdapter from './httpAdapter'

const api = new ApiClient(new HttpAdapter(axios.create({
  baseURL: process.env.REACT_APP_API_URL
})))

export default api