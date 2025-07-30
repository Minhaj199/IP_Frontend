export class AppError extends Error {
  public errorType: string;
  public result: Record<string, string>[];

  constructor(
    message: string,
    errorType: string = "internal error",
    result: Record<string, string>[] = []
  ) {
    super(message);
    this.errorType = errorType;
    this.result = result;
    console.log(this.result);
  }

  toJSON() {
    return {
      message: this.message,
      errorType: this.errorType,
      result: this.result,
    };
  }
}
