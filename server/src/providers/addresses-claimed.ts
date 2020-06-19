import AddressesClaimedModel from "../models/addresses-claimed";
import logger from "../helpers/pino-logger";

const log = logger.child({ from: "Provider: AddressesClaimed" });

type AddressesClaimedType = {
  address: string;
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
