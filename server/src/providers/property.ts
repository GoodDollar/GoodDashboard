import { get, isUndefined } from 'lodash'

import PropertiesModel from '../models/properties'
import logger from '../helpers/pino-logger'

const log = logger.child({ from: 'PropertiesModel' })

class Property {
  model: typeof PropertiesModel

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
    const { model } = this

    try {
      await model.deleteOne({ property })
      await model.create({ property, value }) // Model.update + upsert doesn't supports discriminators

      return true
    } catch (exception) {
      const { message } = exception

      log.error('Update property failed [mongo actions]:', { message, property, value })
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
  async get<T = string>(property: string, defaultValue?: T): Promise<T> {
    const result = await this.model
      .findOne({ property })
      .lean()

    const defValue = isUndefined(defaultValue) ? '' : defaultValue

    return get(result, 'value', defValue) as T
  }

  /**
   * Get all properties
   *
   * @returns {Promise<*>}
   */
  async getAll(): Promise<object> {
    const properties = await this.model.find().lean()

    return properties.reduce((allProps, { property, value }) => {
      allProps[property] = value

      return allProps
    }, {})
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
    const value = await this.get<number>(property) || 0

    await this.set(property, value + by)

    return true
  }
}

export default new Property()
