import mongoose from "../mongo-db.js";
import { MODEL_ABOUT_SERVICE_TRANSACTION } from "./constants";

export const aboutServiceTransactionSchema = new mongoose.Schema({
  count_txs: Number,
  total_amount_txs: Number,
  date: {
    type: String,
    index: { unique: true }
  }
});

export default mongoose.model(MODEL_ABOUT_SERVICE_TRANSACTION, aboutServiceTransactionSchema);
