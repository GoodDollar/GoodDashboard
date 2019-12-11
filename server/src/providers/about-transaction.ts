import AboutTransactionModel from "../models/about-transaction";
import logger from "../helpers/pino-logger";

const log = logger.child({ from: "Transaction" });

type aboutTransaction = {
  count_txs: number;
  amount_txs: number;
  unique_txs: Array<string>;
  date: string;
};

class AboutTransaction {
  model: any;

  constructor() {
    this.model = AboutTransactionModel;
  }

  /**
   * Create or update wallet
   *
   * @param {transaction} transaction
   *
   * @returns {Promise<void>}
   */

  async set(aboutTransaction: aboutTransaction): Promise<boolean> {
    try {
      await this.model.create(aboutTransaction);
      return true;
    } catch (ex) {
      log.error("Update aboutTransaction failed [mongo actions]:", { message: ex.message, aboutTransaction });
    }

    return false;
  }

  async updateOrSet(aboutTransactions: object): Promise<boolean> {
    const params = [];
    if (aboutTransactions) {
      for (const i in aboutTransactions) {
        // @ts-ignore
        let aboutTransaction: aboutTransaction = aboutTransactions[i];
        let inc = {};
        for (let f in aboutTransaction) {
          // @ts-ignore
          if (typeof aboutTransaction[f] === "number" && aboutTransaction[f] > 0) {
            // @ts-ignore
            inc[f] = aboutTransaction[f];
          }
        }
        params.push({
          updateOne: {
            filter: { date: aboutTransaction.date },
            update: {
              date: aboutTransaction.date,
              $inc: inc,
              $addToSet: { unique_txs: Object.keys(aboutTransaction["unique_txs"]) }
            },
            upsert: true,
            new: true
          }
        });
      }
      if (params.length > 0) await this.model.bulkWrite(params);
    }

    return true;
  }

  async getByDate(date: string) {
    return this.model.findOne({ date: date });
  }

  /**
   * Get all wallets
   *
   * @returns {Promise<*>}
   */
  async getAll(start: number = 1, limit: number = 50) {
    return this.model
      .find({})
      .sort({ date: -1 })
      .skip(start)
      .limit(limit);
  }

  async getTotalTX() {
    const result = await this.model.aggregate([{ $group: { _id: "transactions", totalTX: { $sum: "$count_txs" } } }]);
    return result[0].totalTX;
  }

  async getTotalAmount() {
    const result = await this.model.aggregate([
      { $group: { _id: "transactions", totalAmount: { $sum: "$amount_txs" } } }
    ]);
    return result[0].totalAmount;
  }

  async getAvgDailyCountOfTransactions() {
    const result = await this.model.aggregate([
      { $group: { _id: "transactions", avgDayCount: { $avg: "$count_txs" } } }
    ]);
    return result[0].avgDayCount;
  }
}

export default new AboutTransaction();
