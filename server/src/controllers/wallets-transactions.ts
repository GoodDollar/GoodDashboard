import { NextFunction, Request, Response } from "express";
import config from '../config'
import walletsProvider from "../providers/wallets";


const getTopLowMediumBalance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await walletsProvider.getTopLowMediumBalanceByField('countTx')

    return res.status(200).json({
      responseCode: 200,
      data,
      success: true
    })
  }

  catch (error) {
    return res.status(500).json({
      message: error.message ? error.message : 'Unexpected error occure.'
    })
  }
}

const getTopAccounts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transactionSortDirection = (req.query.transactionSortDirection) ? req.query.transactionSortDirection : 'desc'
    const transactionSort = (req.query.transactionSort) ? req.query.transactionSort : 'countTx'

    const data = await walletsProvider.getTopAccountsByField(transactionSort, transactionSortDirection, 10)


    return res.status(200).json({
      responseCode: 200,
      data,
      success: true
    })
  }

  catch (error) {
    return res.status(500).json({
      message: error.message ? error.message : 'Unexpected error occure.'
    })
  }
}

const getDistributionHistogram  = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await walletsProvider.getDistributionHistogramByField('countTx',config.stepDistributionHistogramWalletTransaction)

    return res.status(200).json({
      responseCode: 200,
      data,
      success: true
    })
  }

  catch (error) {
    return res.status(500).json({
      message: error.message ? error.message : 'Unexpected error occure.'
    })
  }
}

export default {
  getTopLowMediumBalance,
  getTopAccounts,
  getDistributionHistogram
};