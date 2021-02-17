import { Request, Response } from 'express';

export default () => (_req: Request, res: Response) => {
  res.sendStatus(200);
};
