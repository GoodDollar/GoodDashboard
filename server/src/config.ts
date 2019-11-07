import _ from 'lodash'
import networks from './networks'
require('dotenv').config()
const convict = require('convict')
import ContractsAddress from '@gooddollar/goodcontracts/releases/deployment.json'

// Define a schema
const conf = convict({
  env: {
    doc: 'The applicaton environment.',
    format: ['production', 'development', 'staging', 'test'],
    default: 'development',
    arg: 'nodeEnv',
    env: 'NODE_ENV'
  },
  ip: {
    doc: 'The IP address to bind.',
    format: 'ipaddress',
    default: '127.0.0.1',
    env: 'IP_ADDRESS'
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3003,
    env: 'PORT'
  },
  logLevel: {
    doc: 'Log level',
    format: ['debug', 'error', 'warn', 'info', 'off', 'trace'],
    default: 'debug',
    env: 'LOG_LEVEL'
  },
  timeUpdate: {
    doc: 'data refresh interval',
    format: Number,
    default: 1800000,
    env: 'DATA_REFRESH_INTERVAL'
  },
  ethereum: {
    network_id: 42,
    httpWeb3Provider: 'https://kovan.infura.io/v3/',
    websocketWeb3Provider: 'wss://kovan.infura.io/ws',
    web3Transport: 'HttpProvider'
  },
  network: {
    doc: 'The blockchain network to connect to',
    format: [
      'kovan',
      'mainnet',
      'rinkbey',
      'ropsten',
      'truffle',
      'ganache',
      'fuse',
      'production',
      'develop',
      'staging'
    ],
    default: 'develop',
    env: 'NETWORK'
  },
  mongodb: {
    uri: {
      doc: 'Mongo DB URI',
      format: '*',
      env: 'MONGO_DB_URI',
      default: ''
    }
  },
  secure_key: {
    doc: 'Secure key word used to create secure hash by which server can communicate with web3',
    format: '*',
    env: 'SECURE_KEY',
    default: undefined
  },
  fuse: {
    doc: 'Main url for fuse api',
    format: String,
    env: 'FUSE_API',
    default: null
  },
})

// Load environment dependent configuration
const env = conf.get('env')
const network = conf.get('network')

conf.set('ethereum', _.get(networks,`[${_.get(ContractsAddress,`[${network}].networkId`)}]`))


export default conf.getProperties()
