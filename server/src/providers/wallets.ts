import WalletsModel from '../models/wallets'
import logger from '../helpers/pino-logger'

const log = logger.child({ from: 'WalletsModelModel' })

type wallet = {
  address: string
  balance: number,
  from: number,
  to: number,
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
      const walletDb: any = await this.getByAddress(wallet.address)
      if (walletDb) {
        walletDb.from = wallet.from + walletDb.from
        walletDb.to = wallet.to + walletDb.to
        walletDb.balance = wallet.balance
        walletDb.save()
      } else {
        await this.model.create(wallet)
      }

      return true

    } catch (ex) {
      log.error('Update user failed [mongo actions]:', { message: ex.message, wallet})
    }

    return false
  }

  async getByAddress(address:string): Promise<boolean> {
    return await this.model.findOne({ address })
  }
  /**
   * Get all wallets
   *
   * @returns {Promise<*>}
   */
  async getAll(): Promise<object> {
    return await this.model.find().lean()
  }

  async getTopLowMediumBalance() {
    const topLow =  await this.model.aggregate([
      { $group: {
          _id: null,
          top: { $max: '$balance' },
          low: { $min: '$balance' }
        }
      },
    ])
    const count = await this.model.count()
    const skip =  count / 2
    const medium = await this.model.find({}, ['balance'],
      {
        skip: skip,
        limit: 1,
        sort:{
          balance: -1 //Sort by balance DESC
        }
      }
    )

    return {
      top: (topLow) ? topLow[0].top : 0,
      low:  (topLow) ? topLow[0].low : 0,
      median: (medium) ? medium[0].balance : 0
    }
  }

  async getTopAccounts(count: number) {

    const topAccounts = await this.model.find({}, [],
      {
        skip: 0,
        limit: count,
        sort:{
          balance: -1 //Sort by balance DESC
        }
      }
    )

    return topAccounts
  }
}

export default new Property()
