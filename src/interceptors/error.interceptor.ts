import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

function doException(context: ExecutionContext, err) {
  console.log(err);
  try {
    if (err instanceof HttpException) {
      return err;
    } else if (err.status === 'error') {
      return new HttpException(
        {
          statusCode: HttpStatus.BAD_GATEWAY,
          message: err.message,
          timestamp: new Date().toISOString(),
          path: context.switchToHttp().getRequest().url,
        },
        HttpStatus.BAD_GATEWAY,
      );
    } else {
      let error = err.message;

      if (err.error) {
        error = `${err.error}: ${err?.message}`;
      }

      if (err.response && err.response.error) {
        error = `${err.response.error}: ${err.response?.message}`;
      }

      return new HttpException(
        {
          statusCode: err.status,
          message: error,
          error: error,
          timestamp: new Date().toISOString(),
          path: context.switchToHttp().getRequest().url,
        },
        err.status,
      );
    }
  } catch {
    return new HttpException('Something went wrong', HttpStatus.BAD_GATEWAY);
  }
}

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((err) => {
        return throwError(doException(context, err));
      }),
    );
  }
}
