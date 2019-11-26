import TransactionsModel from '../models/transactions'
import logger from '../helpers/pino-logger'

const log = logger.child({ from: 'Transactions' })

type transaction = {
  hash: string,
  value: number,
  blockNumber: string,
  time: number,
  from: string,
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
    return await this.model.find().lean()
  }


  async getCountByWallet(wallet: string) {
    const count = await this.model.find({from: wallet}).count()

    return count
  }

  async getTotal() {
    const count = await this.model.find().count()

    return count
  }

  async getTotalAmount() {
    const count = await this.model.aggregate([
      {$group :{ _id : "transactions", totalAmount: { $sum : "$value" }}}
    ]);
    return count
  }

  async getAvgAmount() {
    const count = await this.model.aggregate([
      {$group :{ _id : "transactions", avgAmount: { $avg : "$value" }}}
    ]);
    return count[0].avgAmount
  }


}

export default new Transactions()
