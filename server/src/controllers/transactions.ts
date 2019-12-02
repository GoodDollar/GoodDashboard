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
    const data = await transactionsProvider.getAvgDailyCountOfTransactions()

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

const getCountPerDay = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let data = await transactionsProvider.getCountPerDay()
    data = prepareDataForGraph(data, 'count')
    return res.status(200).json({
      responseCode: 200,
      data: data,
      success: true
    })
  }

  catch (error) {
    return res.status(500).json({
      message: error.message ? error.message : 'Unexpected error occure.'
    })
  }
}

const getAmountPerDay = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let data = await transactionsProvider.getAmountPerDay()
    data = prepareDataForGraph(data, 'avgAmount')
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

const prepareDataForGraph = (data:any, yField: string) => {
  let result = []
  for (let i in data) {
    let item = data[i]
    result.push({
      x: item._id.date,
      y: item[yField],
    })
  }

  return result
}

const getSumAmountPerDay = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let data = await transactionsProvider.getSumAmountPerDay()
    data = prepareDataForGraph(data, 'sumAmount')
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
  getAvgAmount,
  getCountPerDay,
  getAmountPerDay,
  getSumAmountPerDay
};