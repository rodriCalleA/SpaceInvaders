import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
@Injectable()
export class AuthTokenInterceptorService implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.search);
    const username = searchParams.get('username');

    return next.handle(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          if (typeof event.body === 'string') {
            localStorage.setItem(
              'authorization',
              JSON.stringify({
                username: username,
                token: event.body,
                time: new Date().getTime(),
              })
            );
          }
        }
      })
    );
  }
}
