import { NextFunction, Request, Response } from 'express'
import blockchainProvider from '../providers/blockchain'

const getEventsCSV = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const csv = await blockchainProvider.ipfslog.getAsCSV()
    const today = new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, '')
    res.attachment(`fuseevents_${today}.csv`)
    return res.status(200).send(csv)
  } catch (error) {
    return res.status(500).json({
      message: error.message ? error.message : 'Unexpected error occure.',
    })
  }
}

export default {
  getEventsCSV,
}
