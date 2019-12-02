import TransactionsModel from '../models/transactions'
import logger from '../helpers/pino-logger'

const log = logger.child({ from: 'Transactions' })

type transaction = {
  hash: string,
  value: number,
  blockNumber: string,
  time: number,
  from: string,
  date: string,
  to: string,
}

class Transactions {

  model:any

  constructor() {
    this.model = TransactionsModel
  }

  /**
   * Create or update wallet
   *
   * @param {transaction} transaction
   *
   * @returns {Promise<void>}
   */
  async set(transaction: transaction): Promise<boolean> {
    try {
      await this.model.create(transaction)
      return true
    } catch (ex) {
      log.error('Update user failed [mongo actions]:', { message: ex.message, transaction})
    }

    return false
  }

  /**
   * Get all wallets
   *
   * @returns {Promise<*>}
   */
  async getAll(): Promise<object> {
    return this.model.find().lean()
  }


  async getCountByWallet(wallet: string) {
    return this.model.find({from: wallet}).count()
  }

  async getTotal() {
    return this.model.find().count()
  }

  async getTotalAmount() {
    const result = await this.model.aggregate([
      {$group :{ _id : "transactions", totalAmount: { $sum : "$value" }}}
    ]);
    return result[0].totalAmount
  }

  async getAvgDailyCountOfTransactions() {
    const result = await this.model.aggregate([
      {$group :{ _id : {date:"$date"}, avgAmount: { $avg : "$value" }}},
      {$group :{ _id : 'transactions', avgDyaAmount: { $avg : "$avgAmount" }}}
    ]);
    return result[0].avgDyaAmount
  }

  async getCountPerDay() {
    const result = await this.model.aggregate([
      {$group :{ _id : {date:"$date"}, count: { $sum: 1 } }, },
    ]);

    return result
  }

  async getAmountPerDay() {
    const result = await this.model.aggregate([
      {$group :{ _id : {date:"$date"}, avgAmount: { $avg : "$value" }}},
    ]);

    return result
  }

  async getSumAmountPerDay() {
    const result = await this.model.aggregate([
      {$group :{ _id : {date:"$date"}, sumAmount: { $sum : "$value" }}},
    ]);

    return result
  }
}

export default new Transactions()
