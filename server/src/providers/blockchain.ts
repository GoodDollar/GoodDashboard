import Web3 from 'web3'
import moment from 'moment'
import GoodDollarABI from '@gooddollar/goodcontracts/build/contracts/GoodDollar.json'
import OneTimePaymentsABI from '@gooddollar/goodcontracts/build/contracts/OneTimePayments.min.json'
import UBIABI from '@gooddollar/goodcontracts/build/contracts/FixedUBI.min.json'
import BonusABI from '@gooddollar/goodcontracts/build/contracts/SignUpBonus.min.json'
import ContractsAddress from '@gooddollar/goodcontracts/releases/deployment.json'
import conf from '../config'
import logger from '../helpers/pino-logger'
import get from 'lodash/get'
import _invert from 'lodash/invert'
import propertyProvider from './property'
import walletsProvider from './wallets'
import AboutTransactionProvider from './about-transaction'
import Amplitude from './amplitude'
import IPFSLog from './ipfs'

import * as web3Utils from 'web3-utils'
const log = logger.child({ from: 'Blockchain' })

/**
 * This varb save unique address per day
 */
let uniqueTxs = {
  now: '',
  uniqueAddress: [],
}
/**
 * Exported as blockchain
 * Interface with blockchain contracts via web3 using HDWalletProvider
 */
export class blockchain {
  web3: any

  wallet: any

  ready: any

  tokenContract: any

  ubiContract: any

  bonusContract: any

  otplContract: any

  lastBlock: number

  listPrivateAddress: any

  network: string

  networkId: number

  amplitude: Amplitude

  ipfslog: IPFSLog

  constructor() {
    this.lastBlock = 0
    this.network = conf.network
    this.networkId = conf.ethereum.network_id
    this.ready = this.init()
    this.listPrivateAddress = _invert(get(ContractsAddress, `${this.network}`))
    this.amplitude = new Amplitude()
    this.ipfslog = new IPFSLog()
    log.info('Starting blockchain reader:', {
      network: this.network,
      networkdId: this.networkId,
      systemContracts: this.listPrivateAddress,
    })
  }

  /**
   * Return transport provider for web3 connection
   */
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

  /**
   * Main process, it run all update
   */
  async init() {
    log.debug('Initializing blockchain:', { conf: conf.ethereum })
    this.lastBlock = await propertyProvider
      .get('lastBlock')
      .then(_ => +_)
      .catch(_ => 0)
    await this.ipfslog.ready
    this.ipfslog.logEventAsCSV('TEST', { a: 1, b: Math.random() })
    this.web3 = new Web3(this.getWeb3TransportProvider())
    const address: any = get(ContractsAddress, `${this.network}.GoodDollar`)
    this.tokenContract = new this.web3.eth.Contract(GoodDollarABI.abi, address)
    this.ubiContract = new this.web3.eth.Contract(UBIABI.abi, get(ContractsAddress, `${this.network}.UBI`))
    this.otplContract = new this.web3.eth.Contract(
      OneTimePaymentsABI.abi,
      get(ContractsAddress, `${this.network}.OneTimePayments`)
    )
    this.bonusContract = new this.web3.eth.Contract(BonusABI.abi, get(ContractsAddress, `${this.network}.SignupBonus`))

    try {
      log.debug('blockchain Ready:', {
        network: this.networkId,
      })
    } catch (e) {
      log.error('Error initializing wallet', { e }, e.message)
    }
    return true
  }

  /**
   * Get true if not private wallet
   * @param wallet
   */
  isClientWallet(wallet: string) {
    return this.listPrivateAddress[this.web3.utils.toChecksumAddress(wallet)] === undefined
  }

  /**
   * Update all date BChain
   */
  async updateData() {
    await this.ready
    await this.updateEvents()
    const oneTimePaymentLinksAddress: any = get(ContractsAddress, `${this.network}.OneTimePayments`)
    const inEscrow = await this.tokenContract.methods.balanceOf(oneTimePaymentLinksAddress).call()
    await propertyProvider.set('inEscrow', +inEscrow)
  }

  async updateEvents() {
    const blockNumber = await this.web3.eth.getBlockNumber()
    log.info('updateEvents starting:', { blockNumber })
    await Promise.all([
      this.updateListWalletsAndTransactions(blockNumber).catch(e => log.error('transfer events failed', e.message, e)),
      this.updateBonusEvents(blockNumber).catch(e => log.error('bonus events failed', e.message, e)),
      this.updateClaimEvents(blockNumber).catch(e => log.error('claim events failed', e.message, e)),
      this.updateOTPLEvents(blockNumber).catch(e => log.error('otpl events failed', e.message, e)),
    ])
    await propertyProvider.set('lastBlock', +blockNumber)
    await this.amplitude.sendBatch()
    await this.ipfslog.persist()
  }

  async updateBonusEvents(toBlock: number) {
    const allEvents = await this.bonusContract.getPastEvents('BonusClaimed', {
      fromBlock: +this.lastBlock > 0 ? +this.lastBlock : 0,
      toBlock,
    })

    log.info('got Bonus events:', allEvents.length)

    for (let index in allEvents) {
      let event = allEvents[index]
      let toAddr = event.returnValues.account
      let blockNumber = event.blockNumber
      const txTime = (await this.web3.eth.getBlock(blockNumber)).timestamp
      if (+txTime < +conf.startTimeTransaction) {
        continue
      }

      const amountTX = web3Utils.hexToNumber(event.returnValues.amount)

      this.amplitude.logEvent({
        user_id: toAddr,
        insert_id: event.transactionHash + '_' + event.logIndex,
        event_type: 'FUSE_BONUS',
        time: txTime,
        event_properties: {
          toAddr,
          value: amountTX / 100,
          isToSystem: this.isClientWallet(toAddr) === false,
        },
      })
      this.ipfslog.logEventAsCSV('FUSE_BONUS', {
        time: txTime,
        toAddr,
        value: amountTX / 100,
        isToSystem: this.isClientWallet(toAddr) === false,
        insert_id: event.transactionHash + '_' + event.logIndex,
      })
    }
  }

  async updateClaimEvents(toBlock: number) {
    const allEvents = await this.ubiContract.getPastEvents('UBIClaimed', {
      fromBlock: +this.lastBlock > 0 ? +this.lastBlock : 0,
      toBlock,
    })

    log.info('got Claim events:', allEvents.length)

    for (let index in allEvents) {
      let event = allEvents[index]
      let toAddr = event.returnValues.claimer
      let blockNumber = event.blockNumber
      const txTime = (await this.web3.eth.getBlock(blockNumber)).timestamp
      if (+txTime < +conf.startTimeTransaction) {
        continue
      }

      const amountTX = web3Utils.hexToNumber(event.returnValues.amount)

      this.amplitude.logEvent({
        user_id: toAddr,
        insert_id: event.transactionHash + '_' + event.logIndex,
        event_type: 'FUSE_CLAIM',
        time: txTime,
        event_properties: {
          toAddr,
          value: amountTX / 100,
          isToSystem: this.isClientWallet(toAddr) === false,
        },
      })

      this.ipfslog.logEventAsCSV('FUSE_CLAIM', {
        time: txTime,
        toAddr,
        value: amountTX / 100,
        isToSystem: this.isClientWallet(toAddr) === false,
        insert_id: event.transactionHash + '_' + event.logIndex,
      })
    }
  }

  async updateOTPLEvents(toBlock: number) {
    const allEvents = await this.otplContract.getPastEvents('allEvents', {
      fromBlock: +this.lastBlock > 0 ? +this.lastBlock : 0,
      toBlock,
    })

    log.info('got OTPL events:', allEvents.length)

    for (let index in allEvents) {
      let event = allEvents[index]
      let fromAddr = event.returnValues.from
      let toAddr = event.returnValues.to
      let blockNumber = event.blockNumber
      const txTime = (await this.web3.eth.getBlock(blockNumber)).timestamp
      if (+txTime < +conf.startTimeTransaction) {
        continue
      }

      const amountTX = web3Utils.hexToNumber(event.returnValues.amount)

      this.amplitude.logEvent({
        user_id: toAddr ? toAddr : fromAddr,
        insert_id: event.transactionHash + '_' + event.logIndex,
        event_type: 'FUSE_' + event.event,
        time: txTime,
        event_properties: {
          fromAddr,
          toAddr,
          value: amountTX / 100,
          isFromSystem: this.isClientWallet(fromAddr) === false,
          isToSystem: toAddr && this.isClientWallet(toAddr) === false,
        },
      })

      this.ipfslog.logEventAsCSV('FUSE_' + event.event, {
        time: txTime,
        fromAddr,
        toAddr,
        value: amountTX / 100,
        isFromSystem: this.isClientWallet(fromAddr) === false,
        isToSystem: this.isClientWallet(toAddr) === false,
        insert_id: event.transactionHash + '_' + event.logIndex,
      })
    }
  }

  /**
   * Update list wallets and transactions info
   */
  async updateListWalletsAndTransactions(toBlock: number) {
    let wallets: any = {}
    let aboutTXs: any = {}
    let lastBlock = this.lastBlock
    log.info('last Block', lastBlock)

    const allEvents = await this.tokenContract.getPastEvents('Transfer', {
      fromBlock: +lastBlock > 0 ? +lastBlock : 0,
      toBlock,
    })
    log.info('got Transfer events:', allEvents.length)
    for (let index in allEvents) {
      let event = allEvents[index]
      let fromAddr = event.returnValues.from
      let toAddr = event.returnValues.to
      let blockNumber = event.blockNumber
      const txTime = (await this.web3.eth.getBlock(blockNumber)).timestamp

      if (+txTime < +conf.startTimeTransaction) {
        continue
      }

      const amountTX = web3Utils.hexToNumber(event.returnValues.value)

      this.amplitude.logEvent({
        user_id: fromAddr,
        insert_id: event.transactionHash + '_' + event.logIndex,
        event_type: 'FUSE_TRANSFER',
        time: txTime,
        event_properties: {
          fromAddr,
          toAddr,
          value: amountTX / 100,
          isFromSystem: this.isClientWallet(fromAddr) === false,
          isToSystem: this.isClientWallet(toAddr) === false,
        },
      })

      this.ipfslog.logEventAsCSV('FUSE_TRANSFER', {
        time: txTime,
        fromAddr,
        toAddr,
        value: amountTX / 100,
        isFromSystem: this.isClientWallet(fromAddr) === false,
        isToSystem: this.isClientWallet(toAddr) === false,
        insert_id: event.transactionHash + '_' + event.logIndex,
      })

      // log.debug("Event:", { fromAddr, toAddr, event });
      if (this.isClientWallet(fromAddr)) {
        let timestamp = moment.unix(txTime)
        let date = timestamp.format('YYYY-MM-DD')
        log.debug('Client Event:', { date, fromAddr, toAddr })

        if (aboutTXs.hasOwnProperty(date)) {
          aboutTXs[date].amount_txs += amountTX
          aboutTXs[date].count_txs += 1
          aboutTXs[date].unique_txs[fromAddr] = true
        } else {
          aboutTXs[date] = {
            date,
            amount_txs: amountTX,
            count_txs: 1,
            unique_txs: { [fromAddr]: true },
          }
        }

        if (wallets.hasOwnProperty(fromAddr)) {
          wallets[fromAddr].outTXs += 1
          wallets[fromAddr].countTx += 1
        } else {
          wallets[fromAddr] = {
            address: fromAddr,
            outTXs: 1,
            inTXs: 0,
            balance: await this.getAddressBalance(toAddr),
            countTx: 1,
          }
        }
      } else {
        log.trace('Skipping system contracts event', { fromAddr })
      }

      if (this.isClientWallet(toAddr)) {
        if (wallets.hasOwnProperty(toAddr)) {
          wallets[toAddr].inTXs += 1
          wallets[toAddr].countTx += 1
        } else {
          wallets[toAddr] = {
            address: toAddr,
            outTXs: 0,
            inTXs: 1,
            countTx: 1,
            balance: await this.getAddressBalance(toAddr),
          }
        }
      }
    }

    await walletsProvider.updateOrSet(wallets)
    await AboutTransactionProvider.updateOrSet(aboutTXs)
  }

  /**
   *  Get GD balance by address
   * @param {string} address
   */
  async getAddressBalance(address: string): Promise<number> {
    const gdbalance = await this.tokenContract.methods.balanceOf(address).call()

    return gdbalance ? web3Utils.hexToNumber(gdbalance) : 0
  }
}

const Blockchain = new blockchain()

export default Blockchain
