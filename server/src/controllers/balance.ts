import { NextFunction, Request, Response } from "express";
import config from '../config'
import walletsProvider from "../providers/wallets";


const getTopLowMediumBalance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await walletsProvider.getTopLowMediumBalance()

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
    const data = await walletsProvider.getTopAccounts(10)

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
  getTopAccounts
};