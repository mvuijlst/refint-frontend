import { HttpClient } from '@angular/common/http';
import { User } from './../models/user.model';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt/';
import {shareReplay} from 'rxjs/operators/shareReplay';


const helper = new JwtHelperService();

@Injectable()
export class AuthService {
    constructor(private http: HttpClient) { }

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
        return this.http.post<any>('/interim/api-token-auth/', { username, password })
            .do(res => this.addTokens(res.access, res.refresh))
            .shareReplay();
    }

    public refreshToken() {
        const refresh = this.getRefreshToken();
        console.log('refreshtoken');
        console.log(helper.getTokenExpirationDate(refresh));
        console.log(refresh);
        return this.http.post<any>('/interim/api-token-refresh/', { refresh })
            .shareReplay();
    }

    public isAuthenticated(): boolean {
        const token = this.getToken();
        const refreshToken = this.getRefreshToken();
        // if token is expired check te refreshtoken
        return helper.isTokenExpired(token) ? helper.isTokenExpired(refreshToken) ? false : true : true;
    }

    public hasRefreshToken(): boolean {
        const refreshToken = this.getRefreshToken();
        console.log('has refresh token' + refreshToken.length);
        console.log(helper.getTokenExpirationDate(refreshToken));
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
