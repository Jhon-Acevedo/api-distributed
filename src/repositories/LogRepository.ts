import ILogRepository from "./ILogRepository";
import {Log} from "../models/Log";
import {IConnection} from "../connectionDB/IConnection";
import {MongoClient, Collection} from "mongodb";

export class LogRepository implements ILogRepository {

  private _db: Collection;

  constructor(private _dbConnection: IConnection) {
    this._dbConnection.connect();
    this._db = (this._dbConnection.client as MongoClient).db(process.env.DB_NAME).collection(
      process.env.LOGS_COLLECTION_NAME as string
    )
  }

  /**
   * Create a new log in the database
   * @param log log to create
   * @returns the created log
   */
  async createLog(log: Log): Promise<Log> {
    console.log("CreateLOG")
    const inserted = await this._db.insertOne(log)
    return (await this._db
      .findOne({_id: inserted.insertedId})
      .then(result => result)) as Log;
  }

}