import { Router } from '@angular/router';
import { ErrorService } from './error.service';
import { Observable } from 'rxjs/Observable';
import { environment } from './../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User } from './../models/user.model';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt/';
import { of } from 'rxjs/observable/of';
import { shareReplay, tap, catchError } from 'rxjs/operators';


const helper = new JwtHelperService();

@Injectable()
export class AuthService {
    


    authUrl = environment.apiUrl + '/interim/api-token-auth/';
    authRefreshUrl = environment.apiUrl + '/interim/api-token-refresh/';
    constructor(
        private http: HttpClient,
        private errorService: ErrorService,
        private router: Router,
    ) { }

    public getToken(): string {
        return localStorage.getItem('token');
    }

    public getUserId(): number {
        const token = localStorage.getItem('token');
        return +helper.decodeToken(token)['user_id'];
    }

    public getRefreshToken(): string {
        return localStorage.getItem('refresh_token');
    }

    public login(username: string, password: string) {
        return this.http.post<any>(this.authUrl, { username, password }).pipe(
            tap((res) => {this.addTokens(res.access, res.refresh)}),
            catchError(this.errorService.handleError('login', {})),
            shareReplay(),
        );
    }


    public refreshToken(): Observable<any> {
        const refresh = this.getRefreshToken();
        return this.http.post<any>(this.authRefreshUrl, { refresh }).pipe(
            // tap((res)=>console.log(res)),
            shareReplay());
    }

    public isAuthenticated(): boolean {
        const token = this.getToken();
        const refreshToken = this.getRefreshToken();
        const auth =  helper.isTokenExpired(token) ? helper.isTokenExpired(refreshToken) ? false : true : true;
        if (!auth) this.router.navigate(['login'])
        return helper.isTokenExpired(token) ? helper.isTokenExpired(refreshToken) ? false : true : true;
    }

    public hasRefreshToken(): boolean {
        const refreshToken = this.getRefreshToken();
        return refreshToken.length > 0 ? true : false;
    }

    public getHeaderAuthorization(): string {
        return 'Bearer ' + this.getToken();
    }
    public addTokens(accessToken: string, refreshToken: string) {
       if (accessToken.length > 0) { localStorage.setItem('token', accessToken); }
       if (refreshToken.length > 0) { localStorage.setItem('refresh_token', refreshToken); }
    }

    public logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
    }
}
