import WalletsModel from '../models/wallets'
import logger from '../helpers/pino-logger'

const log = logger.child({ from: 'WalletsModelModel' })

type wallet = {
  address: string
  balance: string,
  from: string,
  to: string,
}

class Property {

  model:any

  constructor() {
    this.model = WalletsModel
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
      await this.model.updateOne({ address : wallet.address }, { $set: wallet }, { upsert: true })
      return true
    } catch (ex) {
      log.error('Update user failed [mongo actions]:', { message: ex.message, wallet})
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

}

export default new Property()
