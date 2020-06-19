import PropertiesModel from '../models/properties'
import logger from '../helpers/pino-logger'

const log = logger.child({ from: 'PropertiesModel' })

class Property {

  model:any

  constructor() {
    this.model = PropertiesModel
  }

  /**
   * Create or update user Property date
   *
   * @param {string} property
   * @param {string} value
   *
   * @returns {Promise<void>}
   */
  async set(property: string, value: any): Promise<boolean> {
    try {
      await this.model.updateOne({ property }, { $set: {property, value} }, { upsert: true })
      return true
    } catch (ex) {
      log.error('Update property failed [mongo actions]:', { message: ex.message, property, value })
    }

    return false
  }

  /**
   * Return row by field and value
   *
   * @param {string} property
   *
   * @returns {string || null}
   */
  async get(property: string): Promise<string> {
    const result = await this.model
      .findOne({ property })
      .lean()

    return result ? result['value'] : ''
  }

  /**
   * Get all properties
   *
   * @returns {Promise<*>}
   */
  async getAll(): Promise<object> {
    return await this.model.find().lean()
  }

  /*
  * Increments the number values of provided property
  *
  * @param {string} property
  * @param {number} by - increment value
  *
  * @return {Promise<boolean>}
  */
  async increment(property: string, by: number = 1): Promise<boolean> {
    const value = await this.get(property)
    const newValue = Number(value) + by

    await this.set(property, newValue)

    return true
  }

}

export default new Property()
