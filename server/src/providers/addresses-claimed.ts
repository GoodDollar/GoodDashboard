import AddressesClaimedModel from "../models/addresses-claimed";
import logger from "../helpers/pino-logger";

const log = logger.child({ from: "Provider: AddressesClaimed" });

type AddressesClaimedType = {
  address: string;
};

type MultipleExistsType = {
  existedCount: number,
  nonExistedCount: number,
};

class AddressesClaimed {
  model: any;

  constructor() {
    this.model = AddressesClaimedModel;
  }

  /**
   * Create record with a claimed address
   *
   * @param {AddressesClaimedType} addressesClaimedObj
   *
   * @returns {Promise<boolean>}
   */
  async create(addressesClaimedObj: AddressesClaimedType): Promise<boolean> {
    try {
      await this.model.create(addressesClaimedObj);
      return true;
    } catch (ex) {
      log.error("Creating new addresses-claimed record failed [mongo actions]:", { message: ex.message, addressesClaimedObj });
    }

    return false;
  }

  /**
   * Create multiple records with a provided claimed addresses
   *
   * @param {string[]} addresses
   *
   * @returns {Promise<boolean>}
   */
  async bulkCreate(addresses: string[]): Promise<boolean> {
    try {
      const insertDocs = addresses.map(address => ({
        insertOne: { address },
      }))

      await this.model.bulkWrite(insertDocs)

      return true
    } catch (ex) {
      log.error("Creating new addresses-claimed record failed [mongo actions]:", { message: ex.message });
    }

    return false
  }

  /*
  * Check if the record with provided address already exists
  *
  * @param {string} address
  *
  * @return {Promise<boolean>}
  */
  async checkIfExists(address: string): Promise<boolean> {
    return Boolean(await this.model.findOne({ address }).lean())
  }

  /*
  * Check if the provided addresses already exists
  * create new records in case if not exists
  *
  * @param {string[]} addresses
  *
  * @return {Promise<MultipleExistsType>}
  */
  async checkIfExistsMultiple(addresses: string[]): Promise<MultipleExistsType> {
    const updateDocs = addresses.map(address => ({
      updateOne: {
        filter: { address },
        update: {
          $setOnInsert: {
            address,
          },
        },
        upsert: true
      },
    }))

    const dbResult = await this.model.bulkWrite(updateDocs)

    const nonExistedCount: number = dbResult.nUpserted
    const existedCount: number = addresses.length - nonExistedCount

    return {
      existedCount,
      nonExistedCount,
    }
  }

  /**
   * Get list of all addresses-claimed
   *
   * @param {number} start - Optional. Default 0
   * @param {number} limit - Optional. Default 50
   *
   * @returns {Promise<*>}
   */
  getAll(start: number = 0, limit: number = 50) {
    return this.model
      .find({})
      .sort({ date: -1 })
      .skip(start)
      .limit(limit);
  }
}

export default new AddressesClaimed();
