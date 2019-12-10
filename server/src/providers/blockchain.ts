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
import surveyProvider from "./survey";
import surveyDB from "../gun/models/survey";
import AboutTransactionProvider from "./about-transaction";
import * as web3Utils from "web3-utils";
const log = logger.child({ from: "Blockchain" });

/**
 * This varb save unique address per day
 */
let uniqueTxs = {
  now: "",
  uniqueAddress: []
};
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
    log.info("Starting blockchain reader:", {
      network: this.network,
      networkdId: this.networkId,
      systemContracts: this.listPrivateAddress
    });
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
    return this.listPrivateAddress[this.web3.utils.toChecksumAddress(wallet)] === undefined;
  }

  /**
   * Update all date BChain
   */
  async updateData () {
    await this.updateDataToDB()
    const oneTimePaymentLinksAddress: any = get(ContractsAddress, `${this.network}.OneTimePayments`);
    const inEscrow = await this.tokenContract.methods.balanceOf(oneTimePaymentLinksAddress).call();
    await propertyProvider.set("inEscrow", +inEscrow);
  }

  /**
   * Update list wallets and transactions info
   */
  async updateDataToDB() {
    let wallets: any = {};
    let surveys: any = {};
    let aboutTXs: any = {};
    let lastBlock = await propertyProvider.get("lastBlock");
    let blockNumber: number = 0;
    log.info("last Block", lastBlock);

    const allEvents = await this.tokenContract.getPastEvents("Transfer", {
      fromBlock: +lastBlock > 0 ? +lastBlock : 0,
      toBlock: "latest"
    });

    let lastDateForSurveyNow : string = ''
    for (let index in allEvents) {
      let event = allEvents[index];
      let fromAddr = event.returnValues.from;
      let toAddr = event.returnValues.to;
      const txTime = (await this.web3.eth.getBlock(blockNumber)).timestamp;

      blockNumber = event.blockNumber;

      if (+txTime < +conf.startTimeTransaction) {
        continue;
      }

      // log.debug("Event:", { fromAddr, toAddr, event });
      if (this.isClientWallet(fromAddr)) {
        let timestamp = moment.unix(txTime);
        let date = timestamp.format("YYYY-MM-DD");
        log.debug("Client Event:", { date, fromAddr, toAddr });
        const amountTX = web3Utils.hexToNumber(event.returnValues.value);
        let dateForSurveyNow = timestamp.format("DDMMYY")

        if (lastDateForSurveyNow !== dateForSurveyNow) {
          console.log(dateForSurveyNow)
          const surveyGroupDate = await surveyDB.getGroupDataByDate(dateForSurveyNow)
          lastDateForSurveyNow = dateForSurveyNow
          surveys[dateForSurveyNow] = {
            date,
            ...surveyGroupDate
          }
        }

        if (aboutTXs.hasOwnProperty(date)) {
          aboutTXs[date].amount_txs += amountTX;
          aboutTXs[date].count_txs += 1;
          aboutTXs[date].unique_txs[fromAddr] = true;
        } else {
          aboutTXs[date] = {
            date,
            amount_txs: amountTX,
            count_txs: 1,
            unique_txs: { [fromAddr]: true }
          };
        }

        if (wallets.hasOwnProperty(fromAddr)) {
          wallets[fromAddr].outTXs += 1;
          wallets[fromAddr].countTx += 1;
        } else {
          wallets[fromAddr] = {
            address: fromAddr,
            outTXs: 1,
            inTXs: 0,
            balance: await this.getAddressBalance(toAddr),
            countTx: 1
          };
        }
      } else {
        log.trace("Skipping system contracts event", { fromAddr });
      }

      if (this.isClientWallet(toAddr)) {
        if (wallets.hasOwnProperty(toAddr)) {
          wallets[toAddr].inTXs += 1;
          wallets[toAddr].countTx += 1;
        } else {
          wallets[toAddr] = {
            address: toAddr,
            outTXs: 0,
            inTXs: 1,
            countTx: 1,
            balance: await this.getAddressBalance(toAddr)
          };
        }
      }
    }

    await propertyProvider.set("lastBlock", +blockNumber);
    await walletsProvider.updateOrSet(wallets);
    await AboutTransactionProvider.updateOrSet(aboutTXs);
    await surveyProvider.updateOrSet(surveys)
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
