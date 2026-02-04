import express, { NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import userRouter from '../routes/user-router';
import Logger from '../loaders/logger';

export default ({ app }: { app: express.Application }) => {
  app.get('/status', (req, res) => res.status(200).end());
  app.head('/status', (req, res) => res.status(200).end());

  app.use(
    morgan('combined', {
      stream: { write: (msg: string) => Logger.http(msg) },
    })
  );

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(cors());

  app.use('/user', userRouter);

  app.use((req, res, next) => {
    const err: any = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  app.use((err: any, req: express.Request, res: express.Response, next: NextFunction) => {
    res.status(err.status || 500).json({ errors: { message: err.message } });
  });
};
