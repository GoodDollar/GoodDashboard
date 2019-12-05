import Web3 from "web3";
import moment from "moment";
import GoodDollarABI from "@gooddollar/goodcontracts/build/contracts/GoodDollar.json";
import ContractsAddress from "@gooddollar/goodcontracts/releases/deployment.json";
import conf from "../config";
import logger from "../helpers/pino-logger";
import get from "lodash/get";
import _invert from "lodash/invert";
import propertyProvider from "./property";
import walletsProvider from "./wallets";
import AboutTransactionProvider from "./about-transaction";
import * as web3Utils from "web3-utils";
const log = logger.child({ from: "Blockchain" });

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
  web3: any;

  wallet: any;

  ready: any;

  tokenContract: any;

  listPrivateAddress: any;

  network: string;

  networkId: number;

  constructor() {
    this.network = conf.network;
    this.networkId = conf.ethereum.network_id;
    this.ready = this.init();
    this.listPrivateAddress = _invert(get(ContractsAddress, `${this.network}`));
  }

  /**
   * Return transport provider for web3 connection
   */
  getWeb3TransportProvider(): any {
    let provider: string;
    let web3Provider: any;
    let transport = conf.ethereum.web3Transport;
    switch (transport) {
      case "WebSocket":
        provider = conf.ethereum.websocketWeb3Provider;
        web3Provider = new Web3.providers.WebsocketProvider(provider);
        break;

      case "HttpProvider":
        provider = conf.ethereum.httpWeb3Provider + conf.infuraKey;
        web3Provider = new Web3.providers.HttpProvider(provider);
        break;

      default:
        provider = conf.ethereum.httpWeb3Provider + conf.infuraKey;
        web3Provider = new Web3.providers.HttpProvider(provider);
        break;
    }

    log.debug({ conf, web3Provider, provider });

    return web3Provider;
  }

  /**
   * Main process, it run all update
   */
  async init() {
    log.debug("Initializing blockchain:", { conf: conf.ethereum });

    this.web3 = new Web3(this.getWeb3TransportProvider());
    const address: any = get(ContractsAddress, `${this.network}.GoodDollar`);
    this.tokenContract = new this.web3.eth.Contract(GoodDollarABI.abi, address);

    try {
      log.debug("blockchain Ready:", {
        network: this.networkId
      });
    } catch (e) {
      log.error("Error initializing wallet", { e }, e.message);
    }
    return true;
  }

  /**
   * Get true if not private wallet
   * @param wallet
   */
  isClientWallet(wallet: string) {
    return this.listPrivateAddress[wallet] === undefined;
  }

  /**
   * Update all date BChain
   */
  async updateData () {
    await this.updateListWalletsAndTransactions()
    const oneTimePaymentLinksAddress: any = get(ContractsAddress, `${this.network}.OneTimePayments`);
    const inEscrow = await this.tokenContract.methods.balanceOf(oneTimePaymentLinksAddress).call();
    await propertyProvider.set("inEscrow", +inEscrow);
  }

  /**
   * Check address for unique
   * @param {string} address
   * @param {string} date
   */
  isUniqueAddress(address: string, date: string) {

    if (uniqueTxs.now !== date) {
      uniqueTxs.uniqueAddress = []
      uniqueTxs.now = date
    }

    // @ts-ignore
    if (uniqueTxs.uniqueAddress.indexOf(address) >= 0) {
      return false
    }
    // @ts-ignore
    uniqueTxs.uniqueAddress.push(address)

    return true
  }

  /**
   * Update list wallets and transactions info
   */
  async updateListWalletsAndTransactions() {
    let wallets: any = {};
    let aboutTXs: any = {};
    let lastBlock = await propertyProvider.get("lastBlock");
    let blockNumber: number = 0
    log.info("last Block", lastBlock);

    const allEvents = await this.tokenContract.getPastEvents("Transfer", {
      fromBlock: +lastBlock > 0 ? +lastBlock : 0,
      toBlock: "latest"
    });


    for (let index in allEvents) {
      let event = allEvents[index];
      let fromAddr = event.returnValues.from;
      let toAddr = event.returnValues.to;
      const txTime = (await this.web3.eth.getBlock(blockNumber)).timestamp;

      blockNumber = event.blockNumber;

      if (+txTime < +conf.startTimeTransaction) {
        continue;
      }

      if (this.isClientWallet(fromAddr)) {
        let timestamp = moment.unix(txTime);
        let date = timestamp.format("YYYY-MM-DD")
        console.log('set - at ' + date);
        const amountTX = web3Utils.hexToNumber(event.returnValues.value)

        if (aboutTXs.hasOwnProperty(date)) {
          aboutTXs[date].amount_txs = aboutTXs[date].amount_txs + amountTX;
          aboutTXs[date].count_txs = aboutTXs[date].count_txs + 1;
          aboutTXs[date].unique_txs = aboutTXs[date].unique_txs + Number(this.isUniqueAddress(fromAddr, date))
        } else {
          aboutTXs[date] = {
            date,
            amount_txs: amountTX,
            count_txs: 1,
            unique_txs: Number(this.isUniqueAddress(fromAddr, date))
          }
        }

        if (wallets.hasOwnProperty(fromAddr)) {
          wallets[fromAddr].inTXs = wallets[fromAddr].inTXs + 1;
          wallets[fromAddr].countTx = wallets[fromAddr].countTx + 1;
        } else {
          wallets[fromAddr] = {
            address: fromAddr,
            outTXs: 0,
            inTXs: 1,
            balance: await this.getAddressBalance(toAddr),
            countTx: 1
          };
        }
      }

      if (wallets.hasOwnProperty(toAddr)) {
        wallets[toAddr].outTXs = wallets[toAddr].outTXs + 1;
        wallets[toAddr].countTx = wallets[toAddr].countTx + 1;
      } else {
        wallets[toAddr] = {
            address: toAddr,
            outTXs: 1,
            inTXs: 0,
            countTx: 1,
            balance: await this.getAddressBalance(toAddr),
        };
      }
    }

    await propertyProvider.set("lastBlock", +blockNumber);
    await walletsProvider.updateOrSet(wallets);
    await AboutTransactionProvider.updateOrSet(aboutTXs);

  }

  /**
   *  Get GD balance by address
   * @param {string} address
   */
  async getAddressBalance(address: string): Promise<number> {
    const gdbalance = await this.tokenContract.methods.balanceOf(address).call();

    return gdbalance ? web3Utils.hexToNumber(gdbalance) : 0;
  }
}

const Blockchain = new blockchain();

export default Blockchain;
