import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Logger } from '@nestjs/common';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, path, ip, headers } = request;

    this.logger.log(
      `Request: ${method} ${path} from ${ip}`,
      {
        body: method !== 'GET' ? request.body : undefined,
        query: request.query,
        params: request.params,
        userAgent: headers['user-agent'],
      },
    );

    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        this.logger.log(
          `Response: ${method} ${path} ${response.statusCode} ${Date.now() - now}ms`,
        );
      }),
    );
  }
}