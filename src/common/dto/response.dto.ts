export class SuccessResponseDto<T = any> {
  readonly success: boolean = true;
  readonly message: string;
  readonly data?: T;
  readonly timestamp: string;

  constructor(message: string, data?: T) {
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }
}

export class ErrorResponseDto {
  readonly success: boolean = false;
  readonly message: string;
  readonly error?: string;
  readonly statusCode?: number;
  readonly timestamp: string;

  constructor(message: string, error?: string, statusCode?: number) {
    this.message = message;
    this.error = error;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
  }
}
