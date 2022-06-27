import { Response } from 'express';

export const Errors = {
  E400: (res: Response, message: string) => {
    res.status(400).json({
      code: 400,
      error: 'Bad Request',
      message: message
    });
  },
  E401: (res: Response, message: string) => {
    res.status(401).json({
      code: 401,
      error: 'Unauthorized',
      message: message
    });
  },
  E403: (res: Response, message: string) => {
    res.status(403).json({
      code: 403,
      error: 'Forbidden',
      message: message
    });
  },
  E404: (res: Response, message: string) => {
    res.status(404).json({
      code: 404,
      error: 'Not Found',
      message: message
    });
  },
  E500: (res: Response, message: string) => {
    res.status(500).json({
      code: 500,
      error: 'Internal Server Error',
      message: message
    });
  },
  E501: (res: Response, message: string) => {
    res.status(501).json({
      code: 501,
      error: 'Not Implemented',
      message: message
    });
  },
  E502: (res: Response, message: string) => {
    res.status(502).json({
      code: 502,
      error: 'Bad Gateway',
      message: message
    });
  },
  E503: (res: Response, message: string) => {
    res.status(503).json({
      code: 503,
      error: 'Service Unavailable',
      message: message
    });
  },
  E504: (res: Response, message: string) => {
    res.status(504).json({
      code: 504,
      error: 'Gateway Timeout',
      message: message
    });
  },
  E505: (res: Response, message: string) => {
    res.status(505).json({
      code: 505,
      error: 'HTTP Version Not Supported',
      message: message
    });
  },
  E506: (res: Response, message: string) => {
    res.status(506).json({
      code: 506,
      error: 'Variant Also Negotiates',
      message: message
    });
  },
  E507: (res: Response, message: string) => {
    res.status(507).json({
      code: 507,
      error: 'Insufficient Storage',
      message: message
    });
  },
  E508: (res: Response, message: string) => {
    res.status(508).json({
      code: 508,
      error: 'Loop Detected',
      message: message
    });
  },
  E509: (res: Response, message: string) => {
    res.status(509).json({
      code: 509,
      error: 'Bandwidth Limit Exceeded',
      message: message
    });
  }
};
