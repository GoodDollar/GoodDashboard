import WalletsModel from "../models/wallets";
import logger from "../helpers/pino-logger";

const log = logger.child({ from: "WalletsModelModel" });

type wallet = {
  address: string;
  balance: number;
  outTXs: number;
  inTXs: number;
  countTx: string;
};

class Wallets {
  model: any;

  constructor() {
    this.model = WalletsModel;
  }

  /**
   * Create or update wallet
   *
   * @param {wallet} wallet
   *
   * @returns {Promise<void>}
   */
  async set(wallet: wallet): Promise<boolean> {
    try {
      await this.model.create(wallet);
      return true;
    } catch (ex) {
      log.error("Update user failed [mongo actions]:", { message: ex.message, wallet });
    }

    return false;
  }

  async updateOrSet(wallets: object) {
    const params = [];
    if (wallets) {
      for (const i in wallets) {
        // @ts-ignore
        let wallet: wallet = wallets[i];
        let inc = {};
        for (let f in wallet) {
          // @ts-ignore
          if (typeof wallet[f] === "number" && wallet[f] > 0) {
            // @ts-ignore
            inc[f] = wallet[f];
          }
        }
        params.push({
          updateOne: {
            filter: { address: wallet.address },
            update: {
              address: wallet.address,
              $inc: inc
            },
            upsert: true,
            new: true
          }
        });
      }
      if (params.length > 0) await this.model.bulkWrite(params);
    }
  }

  /**
   * Get wallet by address
   * @param address
   */
  async getByAddress(address: string): Promise<boolean> {
    return await this.model.findOne({ address });
  }
  /**
   * Get all wallets
   *
   * @returns {Promise<*>}
   */
  async getAll(): Promise<object> {
    return await this.model.find().lean();
  }

  /**
   * Return min max field
   *
   * @param {string} field
   */
  async getMinMaxField(field: string) {
    const minMax = await this.model.aggregate([
      {
        $group: {
          _id: null,
          max: { $max: "$" + field },
          min: { $min: "$" + field }
        }
      }
    ]);

    return { max: minMax[0].max, min: minMax[0].min };
  }

  /**
   *  get Top Low Medium By Field
   * @param field
   */
  async getTopLowMediumBalanceByField(field: string) {
    const minMax = await this.getMinMaxField(field);
    const count = await this.model.count();
    const skip = count / 2;
    const medium = await this.model.find({}, [field], {
      skip: skip,
      limit: 1,
      sort: {
        [field]: -1 //Sort by balance DESC
      }
    });
    return {
      top: minMax ? minMax.max : 0,
      low: minMax ? minMax.min : 0,
      median: medium ? medium[0][field] : 0,
      avg: await this.getAvgAmount(field)
    };
  }

  async getAvgAmount(field: string) {
    const count = await this.model.aggregate([{ $group: { _id: "wallet", avgAmount: { $avg: `$${field}` } } }]);
    return count[0].avgAmount;
  }

  /**
   * get total
   */
  async getTotal() {
    const count = await this.model.aggregate([{ $group: { _id: "wallet", total: { $sum: `$balance` } } }]);
    return count[0].total;
  }

  /**
   * get top wallet by field
   * @param filed
   * @param count
   */
  async getTopAccountsByField(filed: string, count: number) {
    const topAccounts = await this.model.find({}, [], {
      skip: 0,
      limit: count,
      sort: {
        [filed]: -1 //Sort by balance DESC
      }
    });

    return topAccounts;
  }

  async getDistributionHistogramByField(field: string, step: number = 5) {
    let result: any = {};
    const minMax = await this.getMinMaxField(field);
    const stepAmount = Math.ceil((minMax.max - minMax.min) / step);

    for (let j = 0; j < step; j++) {
      let minStep: number = stepAmount * j + minMax.min;
      let maxStep: number = stepAmount * j + stepAmount + minMax.min;
      let key = `${minStep}-${maxStep}`;
      result[key] = await this.model.count({ [field]: { $gt: minStep, $lte: maxStep } });
    }

    return result;
  }
}

export default new Wallets();
