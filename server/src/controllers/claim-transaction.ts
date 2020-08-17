import { NextFunction, Request, Response } from "express";
import AboutClaimTransactionProvider from "../providers/about-claim-transactions";
import reqLimit from "../helpers/reqLimit";

const getTotal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await AboutClaimTransactionProvider.getAll(...reqLimit(req));

    const result = data.map((rec: any) => ({
      total_amount_txs: rec.total_amount_txs || 0,
      count_txs: rec.count_txs || 0,
      ubi_quota: rec.ubi_quota || 0,
      date: rec.date,
    }));

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

const getSupplyAmountPerDay = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let data = await AboutClaimTransactionProvider.getAll(...reqLimit(req)) || [];

    const result = data.map(
      (el: any) => ({
        x: el.date,
        y: el.supply_amount || 0,
      })
    );

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
  getSupplyAmountPerDay,
};
