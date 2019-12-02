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
import transactionsProvider from "./transactions";
import * as web3Utils from "web3-utils";
const log = logger.child({ from: "Blockchain" });

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
   *
   */
  async updateListWallets() {
    let wallets: any = {};
    let lastBlock = await propertyProvider.get("lastBlock");
    log.info("last Block", lastBlock);

    const allEvents = await this.tokenContract.getPastEvents("Transfer", {
      fromBlock: +lastBlock > 0 ? +lastBlock : 0,
      toBlock: "latest"
    });

    const oneTimePaymentLinksAddress: any = get(ContractsAddress, `${this.network}.OneTimePayments`);
    const inEscorw = await this.tokenContract.methods.balanceOf(oneTimePaymentLinksAddress).call();

    for (let index in allEvents) {
      let event = allEvents[index];
      let fromAddr = event.returnValues.from;
      let toAddr = event.returnValues.to;
      const blockNumber = event.blockNumber;
      const txTime = (await this.web3.eth.getBlock(blockNumber)).timestamp;

      if (+txTime < +conf.startTimeTransaction) {
        continue;
      }

      if (this.isClientWallet(fromAddr)) {
        let timestamp = moment.unix(txTime);
        await transactionsProvider.set({
          hash: event.blockHash,
          value: web3Utils.hexToNumber(event.returnValues.value),
          blockNumber,
          time: txTime,
          date: timestamp.format("YYYY-MM-DD"),
          from: fromAddr,
          to: toAddr
        });
      }

      if (wallets.hasOwnProperty(fromAddr)) {
        wallets[fromAddr].to = wallets[fromAddr].to + 1;
        wallets[fromAddr].countTx = wallets[fromAddr].countTx + 1;
      } else {
        wallets[fromAddr] = {
            address: fromAddr,
            from: 0,
            to: 1,
            balance: await this.getAddressBalance(fromAddr),
            countTx: 1
        };
      }
      if (wallets.hasOwnProperty(toAddr)) {
        wallets[toAddr].from = wallets[toAddr].from + 1;
        wallets[toAddr].countTx = wallets[toAddr].countTx + 1;
      } else {
        wallets[toAddr] = {
            address: toAddr,
            from: 1,
            to: 0,
            balance: await this.getAddressBalance(toAddr),
            countTx: 1
        };
      }
      await propertyProvider.set("lastBlock", +blockNumber);
    }

    if (wallets) {
      for (let index in wallets) {
        if (this.isClientWallet(wallets[index].address)) {
          wallets[index].countTx = await transactionsProvider.getCountByWallet(wallets[index].address);
          await walletsProvider.set(wallets[index]);
        }
      }
    }

    await propertyProvider.set("inEscorw", +inEscorw);
  }

  /**
   *  Get GD balance by address
   * @param address
   */
  async getAddressBalance(address: string): Promise<number> {
    const gdbalance = await this.tokenContract.methods.balanceOf(address).call();

    return gdbalance ? web3Utils.hexToNumber(gdbalance) : 0;
  }
}

const Blockchain = new blockchain();

export default Blockchain;
