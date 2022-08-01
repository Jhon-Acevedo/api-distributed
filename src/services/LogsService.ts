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
  static async getServerIP(): Promise<string> {
    function json(url:string) {
      return fetch(url).then(res => res.json());
    }

    const apiKey = '45162f2e98694b0fdf7bd02d4146d0559a10afb6bfe598c12d8944fe';
    return await json(`https://api.ipdata.co?api-key=${apiKey}`).then(data => {
      return data.ip
    })

  }
}