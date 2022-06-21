import { IConnection } from './IConnection';
import { MongoClient, Db } from 'mongodb';
import NoClientError from '../errors/NoClientError';
import * as dotenv from 'dotenv';

export default class ConnectionMongo implements IConnection {
  client!: MongoClient;
  private _connected = false;

  constructor() {
    dotenv.config();
  }

  /**
   * connect to mongoDB database
   */

  async connect(): Promise<Db> {
    this._connected = true;
    if (this.client) return this.client.db(process.env.DB_NAME);
    else {
      this.client = new MongoClient(process.env.DB_CONN_STRING);
      return await this.client.connect().then((client) => {
        return client.db(process.env.DB_NAME);
      });
    }
  }

  async disconnect(): Promise<string | void> {
    this._connected = false;
    if (this.client) {
      this.client.close();
    } else {
      throw new NoClientError();
    }
  }

  /**
   * @returns true if connected to mongoDB database otherwise false
   */
  isConnected(): boolean {
    return this._connected;
  }
}
