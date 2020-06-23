import mongoose from '../mongo-db.js'
import { MODEL_ADDRESSES_CLAIMED } from './constants'

export const addressesClaimedSchema = new mongoose.Schema({
  address: {
    type: String,
    index: { unique: true }
  },
})

export default mongoose.model(MODEL_ADDRESSES_CLAIMED, addressesClaimedSchema)
