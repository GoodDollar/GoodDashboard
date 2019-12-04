import AboutTransactionModel from '../models/about-transaction'
import logger from '../helpers/pino-logger'

const log = logger.child({ from: 'Transaction' })

type aboutTransaction = {
  count_txs: number,
  amount_txs: number,
  date: string,
}

class AboutTransaction {

  model:any

  constructor() {
    this.model = AboutTransactionModel
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
      await this.model.create(aboutTransaction)
      return true
    } catch (ex) {
      log.error('Update aboutTransaction failed [mongo actions]:', { message: ex.message, aboutTransaction})
    }

    return false
  }

  async updateOrSet(aboutTransaction: aboutTransaction): Promise<boolean> {
    try {
      const aboutTXs:any = await this.getByDate(aboutTransaction.date)
      if (aboutTXs) {
        aboutTXs.count_txs = aboutTXs.count_txs+aboutTransaction.count_txs
        aboutTXs.amount_txs = aboutTXs.amount_txs+aboutTransaction.amount_txs
        await aboutTXs.save()
      } else {
        await this.set(aboutTransaction)
      }
    } catch (ex) {
      log.error('Update aboutTransaction failed [mongo actions]:', { message: ex.message, aboutTransaction})
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
  async getAll(start: number = 1, limit: number = 20) {
    return this.model.find({}).sort({ date: 1 }).skip(start).limit(limit);
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
    const result = await this.model.aggregate([
      {$group :{ _id : 'transactions', avgDayCount: { $avg : "$count_txs" }}}
    ]);
    return result[0].avgDayCount
  }
}

export default new AboutTransaction()
