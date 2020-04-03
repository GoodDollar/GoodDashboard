import { NextFunction, Request, Response } from "express";
import AboutTransactionProvider from "../providers/about-transaction";

const getTotal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const total = await AboutTransactionProvider.getTotalTX();

    return res.status(200).json({
      responseCode: 200,
      data: total,
      success: true
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure."
    });
  }
};

const getTotalAmount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await AboutTransactionProvider.getTotalAmount();

    return res.status(200).json({
      responseCode: 200,
      data,
      success: true
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure."
    });
  }
};

const getUniquePerDay = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let data = await AboutTransactionProvider.getAll(0,req.query.limit && parseInt(req.query.limit));
    data = prepareDataForGraph(data, "unique_txs", arr => arr.length);

    return res.status(200).json({
      responseCode: 200,
      data,
      success: true
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure."
    });
  }
};

const getAvgCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await AboutTransactionProvider.getAvgDailyCountOfTransactions();

    return res.status(200).json({
      responseCode: 200,
      data,
      success: true
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure."
    });
  }
};

const getCountPerDay = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let data = await AboutTransactionProvider.getAll(0,req.query.limit && parseInt(req.query.limit));
    data = prepareDataForGraph(data, "count_txs");
    return res.status(200).json({
      responseCode: 200,
      data: data,
      success: true
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure."
    });
  }
};

const getAmountPerDay = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let data = await AboutTransactionProvider.getAll(0,req.query.limit && parseInt(req.query.limit));
    data = prepareDataForGraph(data, "amount_txs");
    return res.status(200).json({
      responseCode: 200,
      data,
      success: true
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure."
    });
  }
};

const prepareDataForGraph = (data: any, yField: string, transform: (value: any) => any = _ => _) => {
  let result = [];
  for (let i in data) {
    let item = data[i];
    result.push({
      x: item.date,
      y: transform(item[yField])
    });
  }

  return result;
};

const getAvgAmountPerDay = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let data = await AboutTransactionProvider.getAll(0, req.query.limit && parseInt(req.query.limit));
    let result = [];
    for (let i in data) {
      let item = data[i];
      result.push({
        x: item.date,
        y: item.amount_txs / item.count_txs
      });
    }
    return res.status(200).json({
      responseCode: 200,
      data: result,
      success: true
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure."
    });
  }
};

export default {
  getTotal,
  getTotalAmount,
  getUniquePerDay,
  getAvgCount,
  getCountPerDay,
  getAmountPerDay,
  getAvgAmountPerDay
};
