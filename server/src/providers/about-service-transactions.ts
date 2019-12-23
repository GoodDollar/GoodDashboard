import AboutServiceTransactionModel from "../models/about-service-transactions";

type aboutServiceTransactions = {
  count_txs: number;
  total_amount_txs: number;
  date: string;
};

class AboutServiceTransactions {
  model: any;

  constructor() {
    this.model = AboutServiceTransactionModel;
  }

  async updateOrSet(aboutServiceTransactions: object): Promise<boolean> {
    const params = [];
    if (aboutServiceTransactions) {
      for (const i in aboutServiceTransactions) {
        // @ts-ignore
        let aboutServiceTransaction: aboutServiceTransactions = aboutServiceTransactions[i];
        let inc = {};
        for (let f in aboutServiceTransaction) {
          // @ts-ignore
          if (typeof aboutServiceTransaction[f] === "number" && aboutServiceTransaction[f] > 0) {
            // @ts-ignore
            inc[f] = aboutServiceTransaction[f];
          }
        }
        params.push({
          updateOne: {
            filter: { date: aboutServiceTransaction.date },
            update: {
              date: aboutServiceTransaction.date,
              $inc: inc,
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

  /**
   * Get all transactions
   *
   * @returns {Promise<*>}
   */
  async getAll(start: number = 0, limit: number = 50) {
    return this.model
      .find({})
      .sort({ date: -1 })
      .skip(start)
      .limit(limit);
  }

}

export default new AboutServiceTransactions();
