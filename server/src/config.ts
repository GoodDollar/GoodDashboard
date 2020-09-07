import { get } from 'lodash'
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
  ethereumMainnet: {
    network_id: 3,
    httpWeb3Provider: 'https://rpc.fuse.io/',
    websocketWeb3Provider: 'wss://rpc.fuse.io/ws',
    web3Transport: 'WebSocket',
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
  networkMainnet: {
    doc: 'The blockchain mainnet network to connect to',
    format: String,
    default: '',
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
  reset: {
    doc: 'reset the database if value > last reset value',
    env: 'RESET',
    default: null,
  },
  defipulseKey: {
    doc: ' api key for fetching rates',
    env: 'DEFIPULSE_KEY',
    default: null,
  },
})

// network options
const networks = getNetworks()
const network = conf.get('network')

// @ts-ignore
const networkId: any = ContractsAddress[network].networkId
const mainNetworkId = get(ContractsAddress, `${network}-mainnet.networkId`, networkId)

// @ts-ignore
conf.set('ethereumMainnet', networks[mainNetworkId])
// @ts-ignore
conf.set('ethereum', networks[networkId])
conf.set('networkMainnet', `${network}-mainnet`)

export default conf.getProperties()
