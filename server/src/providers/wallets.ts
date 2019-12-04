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

  /**
   * Return min max field
   *
   * @param {string} field
   */
  async getMinMaxField(field: string) {

    const minMax =  await this.model.aggregate([
      { $group: {
          _id: null,
          max: { $max: '$'+field },
          min: { $min: '$'+field }
        }
      },
    ])

    return { max: minMax[0].max, min: minMax[0].min }
  }


  async getTopLowMediumBalanceByField(field: string) {
    const minMax = await this.getMinMaxField(field)
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
      top: (minMax) ? minMax.max : 0,
      low:  (minMax) ? minMax.min : 0,
      median: (medium) ? medium[0][field] : 0,
      avg: await this.getAvgAmount(field)
    }
  }

  async getAvgAmount(field: string) {
    const count = await this.model.aggregate([
      {$group :{ _id : "wallet", avgAmount: { $avg : `$${field}` }}}
    ]);
    return count[0].avgAmount
  }

  async getTotal() {
    const count = await this.model.aggregate([
      {$group :{ _id : "wallet", total: { $sum : `$balance` }}}
    ]);
    return count[0].total
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

  async getDistributionHistogramByField(field: string, step: number = 5) {
    let result: any = {}
    const minMax = await this.getMinMaxField(field)
    const stepAmount = Math.ceil((minMax.max - minMax.min) / step);

    for (let j = 0; j <= step; j++) {
      let minStep:number = stepAmount * j + minMax.min
      let maxStep:number = stepAmount * j + stepAmount + minMax.min
      let key = `${minStep}-${maxStep}`
      result[key] = await this.model.count({ balance: { $gt: minStep, $lt: maxStep } })
    }

    return result
  }
}

export default new Wallets()
