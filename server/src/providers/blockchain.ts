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
import surveyProvider from './survey'
import surveyDB from '../gun/models/survey'
import AboutTransactionProvider from './about-transaction'
import AboutClaimTransactionProvider from './about-claim-transactions'
import AddressesClaimedProvider from './addresses-claimed'
import PropertyProvider from './property'
import Amplitude from './amplitude'

import * as web3Utils from 'web3-utils'
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

  ubiContract: any

  bonusContract: any

  otplContract: any

  lastBlock: number

  listPrivateAddress: any

  paymentLinkContracts: any

  network: string

  networkId: number

  amplitude: Amplitude

  constructor() {
    this.lastBlock = 0
    this.network = conf.network
    this.networkId = conf.ethereum.network_id
    this.ready = this.init()
    let systemAccounts = Object.values(get(ContractsAddress, `${this.network}`))
      .filter((_) => typeof _ === 'string')
      .concat(conf.systemAccounts, ['0x0000000000000000000000000000000000000000'])
      .map((x) => (x as string).toLowerCase())
    this.listPrivateAddress = _invert(Object.assign(systemAccounts))
    this.paymentLinkContracts = get(ContractsAddress, `${this.network}.OneTimePayments`)
    this.amplitude = new Amplitude()
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

    log.debug({ conf, provider })

    return web3Provider
  }

  /**
   * Main process, it run all update
   */
  async init() {
    log.debug('Config/Status:', await propertyProvider.getAll())
    log.debug('Initializing blockchain:', { conf: conf.ethereum })
    this.lastBlock = await propertyProvider
      .get('lastBlock')
      .then((_) => +_)
      .catch((_) => 0)
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
    return this.listPrivateAddress[wallet.toLowerCase()] === undefined
  }

  /**
   * Get true if wallet is paymentlink contracts
   * @param wallet
   */
  isPaymentlinkContracts(wallet: string) {
    return this.web3.utils.toChecksumAddress(this.paymentLinkContracts) === this.web3.utils.toChecksumAddress(wallet)
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
      this.updateListWalletsAndTransactions(blockNumber).catch((e) =>
        log.error('transfer events failed', e.message, e)
      ),
      // this.updateSurvey(),
      this.updateBonusEvents(blockNumber).catch((e) => log.error('bonus events failed', e.message, e)),
      this.updateClaimEvents(blockNumber).catch((e) => log.error('claim events failed', e.message, e)),
      this.updateOTPLEvents(blockNumber).catch((e) => log.error('otpl events failed', e.message, e)),
      this.updateSupplyAmount().catch((e) => log.error('supply amount update failed', e.message, e)),
    ])
    await propertyProvider.set('lastBlock', +blockNumber)
    this.lastBlock = +blockNumber
    await this.amplitude.sendBatch()
  }

  async updateWalletsBalance() {
    let newBalanceWallets: any = {}
    const wallets = await walletsProvider.getAll()
    for (let i in wallets) {
      // @ts-ignore
      const address = wallets[i].address
      newBalanceWallets[address] = {
        address,
        balance: await this.getAddressBalance(address),
      }
    }
    await walletsProvider.updateOrSet(newBalanceWallets)
    console.log('Finish update wallets balance')
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
    }
  }

  /*
  * Checking if provided addresses did claim at least once
  * if not - increment total unique claimers value
  *
  * @param {string} address - the address to be checked
  *
  * @return {Promise<void>}
  */
  async checkAddressesClaimed(arrayOfAddresses: string[]): Promise<void> {
    // there could be duplicates, so need to get unique values
    // new Set([...]) -> will return unique values from received array
    const uniqueAddresses = [...new Set(arrayOfAddresses)]

    // check multiple addresses exists and create new records in case if not exist by one db query
    const { nonExistedCount } = await AddressesClaimedProvider.checkIfExistsMultiple(uniqueAddresses)

    // if there is some not existed addresses then increment total unique claimers
    if (nonExistedCount) {
      await PropertyProvider.increment('totalUniqueClaimers', nonExistedCount)
    }
  }

  async updateClaimEvents(toBlock: number) {
    const allEvents = await this.ubiContract.getPastEvents('UBIClaimed', {
      fromBlock: +this.lastBlock > 0 ? +this.lastBlock : 0,
      toBlock,
    })

    const aboutClaimTXs: any = {}
    const allAddresses: string[] = []
    let totalUBIDistributed: number = 0

    log.info('got Claim events:', allEvents.length)

    for (let index in allEvents) {
      let event = allEvents[index]
      let blockNumber = event.blockNumber
      const txTime = (await this.web3.eth.getBlock(blockNumber)).timestamp

      if (+txTime < +conf.startTimeTransaction) {
        continue
      }

      const amountTX = web3Utils.hexToNumber(event.returnValues.amount)
      totalUBIDistributed += amountTX

      let timestamp = moment.unix(txTime)
      let date = timestamp.format('YYYY-MM-DD')

      if (aboutClaimTXs.hasOwnProperty(date)) {
        aboutClaimTXs[date].total_amount_txs += amountTX
        aboutClaimTXs[date].count_txs += 1
      } else {
        aboutClaimTXs[date] = {
          date,
          total_amount_txs: amountTX,
          count_txs: 1,
        }
      }

      let toAddr = event.returnValues.claimer
      allAddresses.push(toAddr)

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
    }

    if (totalUBIDistributed) {
      await PropertyProvider.increment('totalUBIDistributed', totalUBIDistributed)
    }

    if (allAddresses.length) {
      await this.checkAddressesClaimed(allAddresses)
    }

    if (Object.keys(aboutClaimTXs).length) {
      await AboutClaimTransactionProvider.updateOrSetInc(aboutClaimTXs)
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
          isFromSystem: fromAddr && this.isClientWallet(fromAddr) === false,
          isToSystem: toAddr && this.isClientWallet(toAddr) === false,
        },
      })
    }
  }

  async updateSupplyAmount() {
    // todo get G$ supply amount from contracts v2
    const amount = await this.tokenContract.methods
      .totalSupply().call()
      .then((n: any) => n.toNumber())
      .catch(() => 0)
    const date = moment().format('YYYY-MM-DD')

    log.info('got amount of G$ supply:', {
      amount,
      date
    })

    const listOfTransactionsData = {
      [date]: {
        date,
        supply_amount: Number(amount),
      }
    }

    await AboutClaimTransactionProvider.updateOrSet(listOfTransactionsData)
  }

  async updateSurvey() {
    let timestamp = moment.unix(conf.startTimeTransaction)
    let startDate = timestamp.format('YYYY-MM-DD')
    let lastDate = await propertyProvider
      .get('lastSurveyDate')
      .then((date) => {
        if (!date) {
          return startDate
        } else {
          return date
        }
      })
      .catch((_) => startDate)

    let from = new Date(lastDate)
    let to = new Date()

    for (; from <= to; ) {
      const surveys = await surveyDB.getByDate(from)
      await surveyProvider.updateOrSet(surveys)
      from.setDate(from.getDate() + 1)
    }

    let lastSurveyDate: string = moment(to).format('YYYY-MM-DD')
    await propertyProvider.set('lastSurveyDate', lastSurveyDate)
  }
  /**
   * Update list wallets and transactions info
   */
  async updateListWalletsAndTransactions(toBlock: number) {
    let wallets: any = {}
    let aboutTXs: any = {}
    let lastBlock = this.lastBlock
    let totalGDVolume: number = 0

    log.info('updateListWalletsAndTransactions - last Block', lastBlock)

    const allEvents = await this.tokenContract.getPastEvents('Transfer', {
      fromBlock: +lastBlock > 0 ? +lastBlock : 0,
      toBlock,
    })

    log.info('updateListWalletsAndTransactions - got Transfer events:', allEvents.length)

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
      totalGDVolume += amountTX

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
            balance: await this.getAddressBalance(fromAddr),
            countTx: 1,
          }
        }
      } else {
        log.trace('Skipping system contracts event', { fromAddr })
      }

      if (this.isClientWallet(toAddr) && (this.isClientWallet(fromAddr) || this.isPaymentlinkContracts(fromAddr))) {
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

    if (totalGDVolume) {
      await PropertyProvider.increment('totalGDVolume', totalGDVolume)
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
