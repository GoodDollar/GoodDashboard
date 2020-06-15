import mongoose from "../mongo-db.js";
import { MODEL_ABOUT_TRANSACTION } from "./constants";

export const aboutTransactionSchema = new mongoose.Schema({
  count_txs: Number,
  amount_txs: Number,
  supply_amount: Number,
  unique_txs: [String],
  date: {
    type: String,
    index: { unique: true }
  }
});

export default mongoose.model(MODEL_ABOUT_TRANSACTION, aboutTransactionSchema);
