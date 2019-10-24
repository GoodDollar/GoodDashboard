import {ErrorRequestHandler, RequestHandler} from 'express'
import httpStatus from 'http-status'

//package.json should import only thru require function
const {name, version} = require('../../package.json')

export const healthCheck: RequestHandler = async (req, res) => res.json({name, version})

export const logErrors: ErrorRequestHandler = (err, req, res, next) => {
  console.error('[ERROR]', `<${req.path}>`, err)
  next(err)
}

export const clientErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err) {
    const {originalUrl: url} = req
    const {code, data} = err
    let message = err.message || String(err) || (httpStatus as any)[httpStatus.INTERNAL_SERVER_ERROR]

    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({url, message, code, data})
  }

  next()
}

export const badRequest: RequestHandler = (req, res) => {
  const {originalUrl: url} = req
  const message = (httpStatus as any)[`${httpStatus.BAD_REQUEST}_MESSAGE`]

  return res.status(httpStatus.BAD_REQUEST).json({message, url})
}