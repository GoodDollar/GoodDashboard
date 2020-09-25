import mongoose from 'mongoose'
import cachegoose from 'cachegoose'
import config from './config'
cachegoose(mongoose, { ttl: 300 })
const { uri } = config.mongodb

export const { Schema } = mongoose
export const { Types } = Schema

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true })

export default mongoose
