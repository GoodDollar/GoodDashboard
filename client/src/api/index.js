import axios from 'axios';
import ApiClient from './apiClient';
import HttpAdapter from './httpAdapter';
import Config from '../config';

const api = new ApiClient(new HttpAdapter(axios.create({
  baseURL: 'http://localhost:3022/api'//Config.apiUrl,
})));

export default api;
