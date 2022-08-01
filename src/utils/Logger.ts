import {Log} from "../models/Log";
import LogsService from "../services/LogsService";

export async function createLog(endpoint: string, request: string, message?: string): Promise<void> {
  function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    }
  );
}


const log = {
  id: uuid(),
  server_ip: LogsService.getServerIP(),
  date: new Date(),
  message: message || '',
  request: request,
} as Log;

}