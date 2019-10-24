import { NextFunction, Request, Response } from "express";
import config from '../config'


const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(200).json({
      responseCode: 200,
      data: config,
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
  getAll
};