import {Log} from "../models/Log";

export default interface ILogRepository {
  createLog(log: Log): Promise<Log>;
}