import { NextFunction, Request, Response } from "express";
import walletsProvider from "../providers/wallets";
import propertyProvider from "../providers/property";

const getTotal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const total = await walletsProvider.getTotal()

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

const getInEscrow = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const inEscrow = await propertyProvider.get('inEscrow')

    return res.status(200).json({
      responseCode: 200,
      data: inEscrow,
      success: true
    })
  }

  catch (error) {
    return res.status(500).json({
      message: error.message ? error.message : 'Unexpected error occure.'
    })
  }
}

const totalImpactStatistic = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalUniqueClaimers = (await propertyProvider.get('totalUniqueClaimers')) || 0
    const totalUBIDistributed = (await propertyProvider.get('totalUBIDistributed')) || 0
    const totalGDVolume = (await propertyProvider.get('totalGDVolume')) || 0

    return res.status(200).json({
      responseCode: 200,
      data: {
        totalUniqueClaimers,
        totalUBIDistributed,
        totalGDVolume
      },
      success: true
    })
  }

  catch (error) {
    return res.status(500).json({
      message: error.message ? error.message : 'Unexpected error occurred.'
    })
  }
}


export default {
  getTotal,
  getInEscrow,
  totalImpactStatistic,
};