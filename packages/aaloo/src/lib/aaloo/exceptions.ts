export class AalooError extends Error {
  name = 'AalooError';

  constructor(message: string) {
    super();
    this.message = `[${this.name}] ${message}`;
  }
}
