import mongoose from 'mongoose'

import config from './config'

const { uri } = config.mongodb

export const { Schema } = mongoose
export const { Types } = Schema

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true })

export default mongoose
