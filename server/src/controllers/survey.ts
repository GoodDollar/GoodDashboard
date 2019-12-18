import { NextFunction, Request, Response } from "express";
import surveyProvider from "../providers/survey";

const getTotal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const skip = (req.query.skip) ? req.query.skip : 0
    const limit = (req.query.limit) ? req.query.limit : 20
    const data = await surveyProvider.getAll(+skip, +limit)
    const count = await surveyProvider.getCount()

    return res.status(200).json({
      responseCode: 200,
      data:{
        list:data,
        count:count
      },
      success: true
    })
  }

  catch (error) {
    return res.status(500).json({
      message: error.message ? error.message : 'Unexpected error occure.'
    })
  }
}

const getCSV = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filename = "survey.csv";
    let bodyFile = 'date,amount,survey,reason,hash\n'

    const data = await surveyProvider.getAll(-1)
    if (data) {
      for(let i in data) {
        bodyFile += `${data[i].date},${data[i].amount/100},${data[i].survey},${data[i].reason},${data[i].hash}\n`
      }
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader("Content-Disposition", 'attachment; filename='+filename);
    res.end(bodyFile);
  }

  catch (error) {
    return res.status(500).json({
      message: error.message ? error.message : 'Unexpected error occure.'
    })
  }
}


export default {
  getTotal,
  getCSV
};