import mongoose from '../mongo-db.js'
import { MODEL_SURVEY } from './constants'

export const surveySchema = new mongoose.Schema({
  service: Number,
  product: Number,
  other: Number,
  date: {
    type: String,
    index: { unique: true }
  },
})

export default mongoose.model(MODEL_SURVEY, surveySchema)
