import mongoose from "../mongo-db.js";
import { MODEL_ABOUT_CLAIM_TRANSACTION } from "./constants";

export const aboutClaimTransactionSchema = new mongoose.Schema({
  count_txs: {
    type: Number,
    default: 0,
  },
  total_amount_txs: {
    type: Number,
    default: 0,
  },
  supply_amount: {
    type: Number,
    default: 0,
  },
  ubi_quota: {
    type: Number,
    default: 0,
  },
  date: {
    type: String,
    index: { unique: true }
  }
});

export default mongoose.model(MODEL_ABOUT_CLAIM_TRANSACTION, aboutClaimTransactionSchema);
