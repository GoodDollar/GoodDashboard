import mongoose from '../mongo-db.js'
import { MODEL_WALLETS } from './constants'

export const walletsSchema = new mongoose.Schema({
  address: {
    type: String,
    index: { unique: true }
  },
  balance: String,
  from: String,
  to: String,
})

export default mongoose.model(MODEL_WALLETS, walletsSchema)
