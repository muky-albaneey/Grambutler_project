import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

export interface ResponseParser<T> {
  data: T;
}

export enum ResponseStatus {
  Success = 'success',
  Failed = 'failed',
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ResponseParser<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseParser<T>> {
    return next.handle().pipe(
      map((response) => ({
        statusCode: context.switchToHttp().getResponse().statusCode,
        status: ResponseStatus.Success,
        count: response?.length ? response.length : 1,
        data: response,
      })),
    );
  }
}
