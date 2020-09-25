import mongoose from '../mongo-db.js'
import { MODEL_WALLETS } from './constants'

export const walletsSchema = new mongoose.Schema({
  address: {
    type: String,
    index: { unique: true },
  },
  balance: { type: Number, index: true },
  outTXs: Number,
  inTXs: Number,
  countTx: { type: Number, index: true },
})

export default mongoose.model(MODEL_WALLETS, walletsSchema)
