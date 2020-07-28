import _ from 'lodash'
import ContractsAddress from '@gooddollar/goodcontracts/releases/deployment.json'
import getNetworks from './networks'

require('dotenv').config()
const convict = require('convict')

// Define a schema
const conf = convict({
  env: {
    doc: 'The applicaton environment.',
    format: ['production', 'development', 'staging', 'test'],
    default: 'development',
    arg: 'nodeEnv',
    env: 'NODE_ENV',
  },
  ip: {
    doc: 'The IP address to bind.',
    format: 'ipaddress',
    default: '127.0.0.1',
    env: 'IP_ADDRESS',
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3003,
    env: 'PORT',
  },
  logLevel: {
    doc: 'Log level',
    format: ['debug', 'error', 'warn', 'info', 'off', 'trace'],
    default: 'debug',
    env: 'LOG_LEVEL',
  },
  cronTimeExpression: {
    doc: 'Cron schedule string for the data refresh task',
    format: String,
    default: '*/30 * * * *',
    env: 'CRON_TIME_EXPRESSION',
  },
  cronTimeZone: {
    doc: 'Timezone for the data refresh task execution context',
    format: String,
    default: Intl.DateTimeFormat().resolvedOptions().timeZone, // falling back to the system tz if not set
    env: 'CRON_TIMEZONE',
  },
  startTimeTransaction: {
    doc: 'start time transaction',
    format: Number,
    default: 1573470000,
    env: 'START_TIME_TRANSACTION',
  },
  stepDistributionHistogramWalletBalance: {
    doc: 'step distribution histogram wallet balance',
    format: Number,
    default: 5,
    env: 'STEP_DISTRIBUTION_HISTOGRAM_WALLET_BALANCE',
  },
  gunPublicUrl: {
    doc: 'step distribution histogram wallet balance',
    format: Number,
    default: 'http://localhost:8765/gun',
    env: 'GUN_PUBLIC_URL',
  },
  stepDistributionHistogramWalletTransaction: {
    doc: 'step distribution histogram wallet transaction',
    format: Number,
    default: 5,
    env: 'STEP_DISTRIBUTION_HISTOGRAM_WALLET_TRANSACTION',
  },
  systemAccounts: {
    doc: 'A list of system account addresses',
    format: Array,
    default: [],
    env: 'SYSTEM_ACCOUNTS',
  },
  ethereum: {
    network_id: 42,
    httpWeb3Provider: 'https://kovan.infura.io/v3/',
    websocketWeb3Provider: 'wss://kovan.infura.io/ws',
    web3Transport: 'HttpProvider',
  },
  ethereumMainNet: {
    network_id: 3,
    httpWeb3Provider: "https://rpc.fuse.io/",
    websocketWeb3Provider: "wss://rpc.fuse.io/ws",
    web3Transport: "WebSocket"
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
      'staging',
    ],
    default: 'develop',
    env: 'NETWORK',
  },
  mongodb: {
    uri: {
      doc: 'Mongo DB URI',
      format: '*',
      env: 'MONGO_DB_URI',
      default: '',
    },
  },
  amplitudeKey: {
    doc: 'Amplitude API Key',
    format: String,
    env: 'AMPLITUDE_KEY',
    default: null,
  },
  fuse: {
    doc: 'Main url for fuse api',
    format: String,
    env: 'FUSE_API',
    default: null,
  },
})

// Load environment dependent configuration
const network = conf.get('network')
const mainNetNetwork = `${network}-mainnet`

// get the network_id by provided network name
const networks = getNetworks()
const getNetworkId = (_network: string) => _.get(networks, `[${_.get(ContractsAddress, `[${_network}].networkId`)}]`)

conf.set('ethereum', getNetworkId(network))
conf.set('ethereumMainNet', getNetworkId(mainNetNetwork))

export default conf.getProperties()
