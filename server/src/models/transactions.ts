import mongoose from '../mongo-db.js'
import { MODEL_TRANSACTIONS } from './constants'

export const transactionsSchema = new mongoose.Schema({
  hash: {
    type: String,
    index: { unique: true }
  },
  value: Number,
  time: Number,
  date: String,
  blockNumber: String,
  from: String,
  to: String,
})

export default mongoose.model(MODEL_TRANSACTIONS, transactionsSchema)
