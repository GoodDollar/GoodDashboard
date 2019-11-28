import { NextFunction, Request, Response } from "express";
import transactionsProvider from "../providers/transactions";


const getTotal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const total = await transactionsProvider.getTotal()

    return res.status(200).json({
      responseCode: 200,
      data: total,
      success: true
    })
  }

  catch (error) {
    return res.status(500).json({
      message: error.message ? error.message : 'Unexpected error occure.'
    })
  }
}



const getTotalAmount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await transactionsProvider.getTotalAmount()

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


const getAvgAmount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await transactionsProvider.getAvgAmount()

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
  getTotal,
  getTotalAmount,
  getAvgAmount
};