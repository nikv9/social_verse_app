class ErrHandler extends Error {
  // Error is an in-built class of Node-js where we are inheriting of that class features
  constructor(status, msg) {
    super(msg);
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}
export default ErrHandler;
