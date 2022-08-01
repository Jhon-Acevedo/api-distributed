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

  async getServerIP(): Promise<string> {
    
  }
}