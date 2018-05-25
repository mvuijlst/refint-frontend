import { Router } from '@angular/router';
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
import { Injectable, Injector } from '@angular/core';
// import 'rxjs/Rx'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { filter } from 'rxjs/operators';
import { take } from 'rxjs/operators';
import 'rxjs/add/observable/throw';

@Injectable()
export class RequestInterceptorService implements HttpInterceptor {

  isRefreshingToken = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  constructor(
    private injector: Injector,
    // private router:Router
  ) { }
  authService = this.injector.get(AuthService);
  router = this.injector.get(Router);
  addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({ setHeaders: { Authorization: 'Bearer ' + token } });
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
      if (
        (req.url.indexOf('/API/messages/') > 0) ||
        (req.url.indexOf('/messagelogdetailtypes') > 0) ||
        (req.url.indexOf('.svg') > 0) 
        // || (req.url.indexOf('api-token-refresh'))>0
      ) {
        return next.handle(req);
      }

      return next.handle(this.addToken(req, this.authService.getToken())).pipe(
        catchError(error => {
          if (error instanceof HttpErrorResponse) {
            switch ((<HttpErrorResponse>error).status) {
              case 400:
                return Observable.throw(new Error(error.error.non_field_errors[0]));
              case 401:
                if (req.url.indexOf('api-token-refresh')>0){
                    this.isRefreshingToken = false;
                    return this.router.navigate(['login']);
                } else{
                    return this.handle401Error(req, next);
                }
              default:
                return Observable.throw(error);
            }
          } else {
            return Observable.throw(new Error(error.message));
          }
        })
      );
  }

  handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;

      this.tokenSubject.next(null);
      
     return this.authService.refreshToken().flatMap((newToken) => {
        this.isRefreshingToken = false
        if (newToken) {
            this.tokenSubject.next(newToken.access);
            this.authService.addTokens(newToken.access, '');
            return next.handle(this.addToken(req, newToken.access));
          }
          else {
            return Observable.throw(new Error('badluck'));
            // return this.router.navigate(['login']);
          }
    });
     } else {
        return this.tokenSubject.pipe(
            filter(token => token != null),
            take(1),
            switchMap(token => {
              return next.handle(this.addToken(req, token));
            }));
    }
    // return next.handle(req  );
    
  }
  logoutUser() {
    // Route to the login page (implementation up to you)
    this.isRefreshingToken= false;
    return this.router.navigate(['login'])
    //   return Observable.throw(new Error('not ok'));
  }
}