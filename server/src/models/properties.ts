import mongoose, { Schema, Types } from '../mongo-db.js'
import { MODEL_PROPERTIES } from './constants'

const schemaOptions = { discriminatorKey: 'property' }

export const propertiesSchema = new Schema({
  property: {
    type: String,
    index: { unique: true }
  },
  value: String,
}, schemaOptions)

const PropertiesModel = mongoose.model(MODEL_PROPERTIES, propertiesSchema)

const numericProperties = [
  'inEscrow',
  'lastBlock',
  'lastVersion',
  'totalUniqueClaimers',
  'totalUBIDistributed',
  'totalGDVolume'
]

numericProperties.forEach(property => PropertiesModel.discriminator(
  property,
  new Schema(
    {
      value: Number
    },
    schemaOptions
  )
))

export default PropertiesModel
