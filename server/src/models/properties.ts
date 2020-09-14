import { forIn } from 'lodash'
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

const PropertiesTypes = {
  inEscrow: Number,
  lastBlock: Number,
  lastVersion: Number,
  totalUniqueClaimers: Number,
  totalUBIDistributed: Number,
  totalGDVolume: Number,
  isInitialUBICalcFetched: Boolean,
  lastSurveyDate: String,
  ipfsMultiHash: String,
  ipfsID: String,
}

forIn(PropertiesTypes, (type, property) => PropertiesModel.discriminator(
  property,
  new Schema(
    {
      value: type
    },
    schemaOptions
  )
))

export default PropertiesModel
