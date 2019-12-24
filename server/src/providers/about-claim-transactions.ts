import AboutClaimTransactionModel from "../models/about-claim-transactions";

type aboutClaimTransactions = {
  count_txs: number;
  total_amount_txs: number;
  date: string;
};

class AboutClaimTransactions {
  model: any;

  constructor() {
    this.model = AboutClaimTransactionModel;
  }

  async updateOrSet(aboutClaimTransactions: object): Promise<boolean> {
    const params = [];
    if (aboutClaimTransactions) {
      for (const i in aboutClaimTransactions) {
        // @ts-ignore
        let aboutClaimTransaction: aboutClaimTransactions = aboutClaimTransactions[i];
        let inc = {};
        for (let f in aboutClaimTransaction) {
          // @ts-ignore
          if (typeof aboutClaimTransaction[f] === "number" && aboutClaimTransaction[f] > 0) {
            // @ts-ignore
            inc[f] = aboutClaimTransaction[f];
          }
        }
        params.push({
          updateOne: {
            filter: { date: aboutClaimTransaction.date },
            update: {
              date: aboutClaimTransaction.date,
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

export default new AboutClaimTransactions();
