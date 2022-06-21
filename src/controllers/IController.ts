import express from 'express';

export interface IController {
  router: express.Router;
  path: string;
}
