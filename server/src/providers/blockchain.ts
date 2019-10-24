import Web3 from "web3"
import GoodDollarABI from '@gooddollar/goodcontracts/build/contracts/GoodDollar.json'
import ContractsAddress from '@gooddollar/goodcontracts/releases/deployment.json'
import conf from '../config'
import logger from '../helpers/pino-logger'
import get from 'lodash/get'
import propertyProvider from './property'
import walletsProvider from './wallets'

const log = logger.child({ from: 'Blockchain' })

/**
 * Exported as blockchain
 * Interface with blockchain contracts via web3 using HDWalletProvider
 */
export class blockchain {

  web3: any

  wallet: any

  ready: any

  tokenContract: any

  network: string

  networkId: number

  constructor() {
    this.network = conf.network
    this.networkId = conf.ethereum.network_id
    this.ready = this.init()
  }

  getWeb3TransportProvider(): any {
    let provider: string
    let web3Provider: any
    let transport = conf.ethereum.web3Transport
    switch (transport) {
      case 'WebSocket':
        provider = conf.ethereum.websocketWeb3Provider
        web3Provider = new Web3.providers.WebsocketProvider(provider)
        break

      case 'HttpProvider':
        provider = conf.ethereum.httpWeb3Provider + conf.infuraKey
        web3Provider = new Web3.providers.HttpProvider(provider)
        break

      default:
        provider = conf.ethereum.httpWeb3Provider + conf.infuraKey
        web3Provider = new Web3.providers.HttpProvider(provider)
        break
    }

    log.debug({ conf, web3Provider, provider })

    return web3Provider
  }

  async init() {

    log.debug('Initializing blockchain:', { conf: conf.ethereum })

    this.web3 = new Web3(this.getWeb3TransportProvider())
    const address: any = get(ContractsAddress, `${this.network}.GoodDollar`)
    this.tokenContract = new this.web3.eth.Contract(
      GoodDollarABI.abi,
      address,
    )

    try {
      log.debug('blockchain Ready:', {
        network: this.networkId,
      })
    } catch (e) {
      log.error('Error initializing wallet', { e }, e.message)
    }
    return true
  }

  async updateListWallets() {
    let wallets:any = {}
    let lastBlock = await propertyProvider.get('lastBlock')
    log.info('last Block', lastBlock)
    const allEvents = await this.tokenContract.getPastEvents('Transfer',
      {
        fromBlock: (+lastBlock > 0) ? +lastBlock: 0,
        toBlock: 'latest',
      }
    )

    for (let index in allEvents) {
      let event = allEvents[index]
      let fromAddr = event.returnValues.from;
      let toAddr = event.returnValues.to;

      if (wallets.hasOwnProperty(fromAddr)) {
        wallets[fromAddr].to = wallets[fromAddr].to + 1
      } else {
        wallets = {
          ...wallets, [fromAddr]: {
            address: fromAddr,
            from: 0,
            to: 1
          }
        }
      }
      if (wallets.hasOwnProperty(toAddr)) {
        wallets[toAddr].from = wallets[toAddr].from + 1
      } else {
        wallets = {
          ...wallets, [toAddr]: {
            address: toAddr,
            from: 1,
            to: 0
          }
        }

      }
      lastBlock = event.blockNumber
    }

    for (let index in wallets) {
      await walletsProvider.set(wallets[index])
    }
    await propertyProvider.set('lastBlock', lastBlock)

  }

}

const Blockchain = new blockchain()

export default Blockchain
