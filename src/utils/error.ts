class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  data?: { [key: string]: any };
  constructor(
    statusCode: number,
    message: string,
    data?: { [key: string]: any }
  ) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = Error.name;
    this.message = message;
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "failure" : "error";
    this.data = data;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
export default AppError;
