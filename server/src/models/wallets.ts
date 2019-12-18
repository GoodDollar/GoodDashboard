import mongoose from '../mongo-db.js'
import { MODEL_WALLETS } from './constants'

export const walletsSchema = new mongoose.Schema({
  address: {
    type: String,
    index: { unique: true }
  },
  balance: Number,
  outTXs: Number,
  inTXs: Number,
  countTx: Number,
})

export default mongoose.model(MODEL_WALLETS, walletsSchema)
