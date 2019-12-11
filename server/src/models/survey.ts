import mongoose from '../mongo-db.js'
import { MODEL_SURVEY } from './constants'

export const surveySchema = new mongoose.Schema({
  hash:{
    type: String,
    index: { unique: true }
  },
  date: String,
  reason: String,
  amount: Number,
  survey: String,
})

export default mongoose.model(MODEL_SURVEY, surveySchema)
