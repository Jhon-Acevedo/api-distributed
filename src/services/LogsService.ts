import ILogRepository from "../repositories/ILogRepository";
import {Log} from "../models/Log";

export default class LogsService {
  private _logRepository: ILogRepository;

  constructor(logRepository: ILogRepository) {
    this._logRepository = logRepository;
  }

  async createLog(log: Log): Promise<Log> {
    return await this._logRepository.createLog(log);
  }

  // TODO: test if this works, if not, find a better way to do this.
  // TODO: check out this: https://ipdata.co/blog/how-to-get-the-ip-address-in-javascript/
  static getServerIP(): string {
    return location.host;
  }
}