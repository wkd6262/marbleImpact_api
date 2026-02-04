import express from 'express';
import config from './config';
import Logger from './loaders/logger';
import { MongoConnector } from './loaders/mongo-connector';
import expressLoader from './loaders/express';

export class MainServer {
  private app = express();

  async start(): Promise<void> {
    Logger.info('Mongo connecting...');
    const mongoConnector = new MongoConnector();
    await mongoConnector.connect();
    Logger.info('Mongo connected...');

    expressLoader({ app: this.app });

    this.app.listen(config.port, () => {
      Logger.info(`marbleImpact_api listening on port ${config.port}`);
    }).on('error', (err: any) => {
      Logger.error(err);
      process.exit(1);
    });
  }
}
