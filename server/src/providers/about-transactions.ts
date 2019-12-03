import AboutTransactionsModel from '../models/about-transactions'
import logger from '../helpers/pino-logger'

const log = logger.child({ from: 'Transactions' })

type aboutTransactions = {
  count_txs: number,
  amount_txs: number,
  date: string,
}

class AboutTransactions {

  model:any

  constructor() {
    this.model = AboutTransactionsModel
  }

  /**
   * Create or update wallet
   *
   * @param {transaction} transaction
   *
   * @returns {Promise<void>}
   */


  async set(aboutTransactions: aboutTransactions): Promise<boolean> {
    try {
      await this.model.create(aboutTransactions)
      return true
    } catch (ex) {
      log.error('Update user failed [mongo actions]:', { message: ex.message, aboutTransactions})
    }

    return false
  }

  async updateOrSet(aboutTransactions: aboutTransactions): Promise<boolean> {
    try {
      const aboutTXs:any = await this.getByDate(aboutTransactions.date)
      if (aboutTXs) {
        aboutTXs.count_txs = aboutTXs.count_txs+aboutTransactions.count_txs
        aboutTXs.amount_txs = aboutTXs.amount_txs+aboutTransactions.amount_txs
        await aboutTXs.save()
      } else {
        await this.set(aboutTransactions)
      }
    } catch (ex) {
      log.error('Update user failed [mongo actions]:', { message: ex.message, aboutTransactions})
    }

    return true
  }

  async getByDate(date: string) {
    return this.model.findOne({ date:date })
  }

  /**
   * Get all wallets
   *
   * @returns {Promise<*>}
   */
  async getAll(): Promise<object> {
    return this.model.find().lean()
  }



  async getTotalTX() {
    const result = await this.model.aggregate([
      {$group :{ _id : "transactions", totalTX: { $sum : "$count_txs" }}}
    ]);
    return result[0].totalTX
  }

  async getTotalAmount() {
    const result = await this.model.aggregate([
      {$group :{ _id : "transactions", totalAmount: { $sum : "$amount_txs" }}}
    ]);
    return result[0].totalAmount
  }

  async getAvgDailyCountOfTransactions() {
    // const result = await this.model.aggregate([
    //   {$group :{ _id : {date:"$date"}, avgAmount: { $avg : "$value" }}},
    //   {$group :{ _id : 'transactions', avgDyaAmount: { $avg : "$avgAmount" }}}
    // ]);
    // return result[0].avgDyaAmount
    return null
  }

  async getCountPerDay() {
    // const result = await this.model.aggregate([
    //   {$group :{ _id : {date:"$date"}, count: { $sum: 1 } }, },
    // ]);
    return null
    // return result
  }

  async getAmountPerDay() {
    // const result = await this.model.aggregate([
    //   {$group :{ _id : {date:"$date"}, avgAmount: { $avg : "$value" }}},
    // ]);

    // return result
    return null
  }

  async getSumAmountPerDay() {
    // const result = await this.model.aggregate([
    //   {$group :{ _id : {date:"$date"}, sumAmount: { $sum : "$value" }}},
    // ]);

    // return result

    return null
  }
}

export default new AboutTransactions()
