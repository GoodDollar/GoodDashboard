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

  async updateOrSet(listOfTransactionsData: any) {
    // verify if any data received - otherwise return true
    if (!(listOfTransactionsData && Object.keys(listOfTransactionsData).length)) {
      // the array where db queries accumulates
      const queries = []

      // map through all received objects
      for (const date in listOfTransactionsData) {
        // the keys of 'listOfTransactionsData' is a date string in format 'YYYY-MM-DD'
        const txData = listOfTransactionsData[date]

        // push a query to update or create tx record
        queries.push({
          updateOne: {
            filter: { date },
            update: {
              $set: txData,
            },
            upsert: true,
          }
        })
      }

      // perform all db requests in parallel with bulkWrite
      await this.model.bulkWrite(queries)
    }

    return true
  }

  async updateOrSetInc(aboutClaimTransactions: object): Promise<boolean> {
    if (aboutClaimTransactions) {
      const params = [];

      for (const i in aboutClaimTransactions) {
        // @ts-ignore
        let aboutClaimTransaction: aboutClaimTransactions = aboutClaimTransactions[i];
        let inc = {};
        for (let field in aboutClaimTransaction) {
          // @ts-ignore
          if (typeof aboutClaimTransaction[field] === "number" && aboutClaimTransaction[field] > 0) {
            // @ts-ignore
            inc[field] = aboutClaimTransaction[field];
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
          }
        });
      }

      await this.model.bulkWrite(params);
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
