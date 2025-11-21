import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const errorResponse = exception.getResponse();

    let message: string;

    if (typeof errorResponse === 'string') {
      message = errorResponse;
    } else if (
      errorResponse &&
      typeof errorResponse === 'object' &&
      'message' in errorResponse
    ) {
      const msg = (errorResponse as { message: string | string[] }).message;
      message = Array.isArray(msg) ? msg.join(', ') : msg;
    } else {
      message = 'An error occurred.';
    }

    const error =
      typeof errorResponse === 'string'
        ? { message: errorResponse, error: null }
        : errorResponse;

    if (!response.headersSent) {
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message,
        data: error,
      });
    }
  }
}
