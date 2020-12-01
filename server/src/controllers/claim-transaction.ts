import { NextFunction, Request, Response } from "express";
import { pick } from 'lodash'
import AboutClaimTransactionProvider from "../providers/about-claim-transactions";
import reqLimit from "../helpers/reqLimit";

const getTotal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await AboutClaimTransactionProvider.getAll(...reqLimit(req));

    const result = data.map((rec: any) => pick(rec, 'total_amount_txs', 'count_txs', 'ubi_quota', 'daily_pool', 'date'))

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
        y: el.supply_amount,
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
