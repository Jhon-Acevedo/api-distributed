import { Response } from 'express';

export const SuccessfulResponses = {
  S200: (res: Response, message: string, data: object) => {
    res.status(200).json({
      message: message,
      data: data
    });
  },
  S201: (res: Response, message: string, data: object) => {
    res.status(201).json({
      message: message,
      data: data
    });
  }
};
