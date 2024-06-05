type ErrorType = "error" | "warning";

export default class CustomError extends Error {
  type: ErrorType;

  constructor(message: string, type: ErrorType) {
    super(message);
    this.type = type;
  }
}
