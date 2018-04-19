import { Observable } from 'rxjs/Observable';
import { AuthService } from './../services/auth.service';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpSentEvent,
  HttpHeaderResponse,
  HttpProgressEvent,
  HttpResponse,
  HttpErrorResponse,
  HttpUserEvent
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { switchMap } from 'rxjs/operators';
import { filter } from 'rxjs/operators';
import { take } from 'rxjs/operators';

@Injectable()
export class RequestInterceptorService implements HttpInterceptor {
  isRefreshingToken = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(private authService: AuthService) { }

  addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({ setHeaders: { Authorization: 'Bearer ' + token } });
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
      return next.handle(this.addToken(req, this.authService.getToken()))
        .catch(error => {
          if (error instanceof HttpErrorResponse) {
            switch ((<HttpErrorResponse>error).status) {
              case 400:
                return Observable.throw(error);
              case 401:
                return this.handle401Error(req, next);
            }
          } else {
            return Observable.throw(error);
          }
        });
  }
  handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    console.log ('handle401');
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;

      // Reset here so that the following requests wait until the token
      // comes back from the refreshToken call.
      this.tokenSubject.next(null);

      return this.authService.refreshToken()
        .switchMap((newToken: any) => {
          if (newToken) {
            console.log ('new token : ' + newToken);
            this.tokenSubject.next(newToken.access);
            this.authService.addTokens(newToken.access, '');
            return next.handle(this.addToken(req, newToken.access));
          }

          // If we don't get a new token, we are in trouble so logout.
          return this.logoutUser();
        })
        .catch(error => {
          // If there is an exception calling 'refreshToken', bad news so logout.
          return this.logoutUser();
        })
        .finally(() => {
          this.isRefreshingToken = false;
        });
    } else {
      return this.tokenSubject
        .filter(token => token != null)
        .take(1)
        .switchMap(token => {
          return next.handle(this.addToken(req, token));
        });
    }
  }
  logoutUser() {
    // Route to the login page (implementation up to you)

    return Observable.throw("");
  }
}