import mongoose from '../mongo-db.js'
import { MODEL_PROPERTIES } from './constants'

export const propertiesSchema = new mongoose.Schema({
  property: {
    type: String,
    index: { unique: true }
  },
  value: String,
})

export default mongoose.model(MODEL_PROPERTIES, propertiesSchema)
