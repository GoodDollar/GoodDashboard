import mongoose from '../mongo-db.js'
import { MODEL_ABOUT_TRANSACTIONS } from './constants'

export const aboutTransactionsSchema = new mongoose.Schema({
  count_txs: Number,
  amount_txs: Number,
  date: String,
})

export default mongoose.model(MODEL_ABOUT_TRANSACTIONS, aboutTransactionsSchema)
