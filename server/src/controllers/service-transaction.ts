import { NextFunction, Request, Response } from "express";
import AboutServiceTransactionProvider from "../providers/about-service-transactions";

const getTotal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const total = await AboutServiceTransactionProvider.getAll();

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


export default {
  getTotal
};
