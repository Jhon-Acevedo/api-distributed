export default class ClientDisconnectedError extends Error {
  constructor(message?: string) {
    super('Client Disconnected' + (message ? ': ' + message : ''));
  }
}
