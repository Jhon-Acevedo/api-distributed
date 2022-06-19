export default class NoClientError extends Error {
    constructor(message?: string) {
        super('No client to disconnect' + (message ? ': ' + message : ''));
    }
}
