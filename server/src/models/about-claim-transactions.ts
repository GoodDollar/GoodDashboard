import mongoose from "../mongo-db.js";
import { MODEL_ABOUT_CLAIM_TRANSACTION } from "./constants";

export const aboutClaimTransactionSchema = new mongoose.Schema({
  count_txs: Number,
  total_amount_txs: Number,
  supply_amount: Number,
  date: {
    type: String,
    index: { unique: true }
  }
});

export default mongoose.model(MODEL_ABOUT_CLAIM_TRANSACTION, aboutClaimTransactionSchema);
