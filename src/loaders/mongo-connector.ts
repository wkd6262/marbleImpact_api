import mongoose from 'mongoose';
import config from '../config';
import Logger from '../loaders/logger';

export class MongoConnector {
  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      mongoose.connection.once('open', () => {
        Logger.info('MongoDB event open');
        resolve(undefined);
      });
      mongoose
        .connect(config.databaseURL!, {
          connectTimeoutMS: 1000 * 60 * 10,
          socketTimeoutMS: 0,
          serverSelectionTimeoutMS: 1000 * 60 * 10,
        })
        .then(() => {
          Logger.info('MongoDB Connected.');
          resolve(undefined);
        })
        .catch(reject);
    });
  }
}
