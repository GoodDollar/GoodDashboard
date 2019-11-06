import WalletsModel from '../models/wallets'
import logger from '../helpers/pino-logger'

const log = logger.child({ from: 'WalletsModelModel' })

type wallet = {
  address: string
  balance: number,
  from: number,
  to: number,
  countTx: string,
}

class Wallets {

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
        walletDb.countTx = wallet.countTx
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

  async getTopLowMediumBalanceByField(field: string) {

    const topLow =  await this.model.aggregate([
      { $group: {
          _id: null,
          top: { $max: '$'+field },
          low: { $min: '$'+field }
        }
      },
    ])
    const count = await this.model.count()
    const skip =  count / 2
    const medium = await this.model.find({}, [field],
      {
        skip: skip,
        limit: 1,
        sort:{
          [field]: -1 //Sort by balance DESC
        }
      }
    )

    return {
      top: (topLow) ? topLow[0].top : 0,
      low:  (topLow) ? topLow[0].low : 0,
      median: (medium) ? medium[0][field] : 0
    }
  }

  async getTopAccountsByField(filed: string, count: number) {

    const topAccounts = await this.model.find({}, [],
      {
        skip: 0,
        limit: count,
        sort:{
          [filed]: -1 //Sort by balance DESC
        }
      }
    )

    return topAccounts
  }

  async getDistributionHistogramByField(field: string, step: number = 25, countIteration: number = 5 ) {
    let result: any = {}
    const allWallets = await this.model.find()

    if (allWallets) {

      for (let i in allWallets) {
        let items = allWallets[i]

        for (let j = 0; j <= countIteration; j++) {
          let minStep = step * j
          let maxStep = step * j + step
          let key = `${minStep}-${ (j === countIteration) ? '~': maxStep}`

          if (!result.hasOwnProperty(key)) {
            result = {[key]: 0, ...result}
          }

          if (items[field] > minStep && items[field] < maxStep) {
            result[key] +=1
          } else if (j === countIteration && items[field] > minStep) {
            result[key] +=1
          }

        }
      }
    }

    return result
  }
}

export default new Wallets()
