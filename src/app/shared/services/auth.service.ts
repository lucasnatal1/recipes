import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

import { User } from '../models/user.model';

interface AuthRequestData {
  email: string;
  password: string;
  returnSecureToken: boolean;
}

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'https://identitytoolkit.googleapis.com/v1/';
  private tokenExpirationTimer: any;

  user = new BehaviorSubject<User>(null); //allow us to subscribe to this subject and get the latest user

  constructor(private http: HttpClient, private router: Router) {}

  signup(email: string, password: string) {
    const authData = this.buildRequestData(email, password);

    return this.http
      .post<AuthResponseData>(
        this.baseUrl + 'accounts:signUp?key=' + environment.firebaseAPIKey,
        authData
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn,
            false
          );
        })
      );
  }

  login(email: string, password: string, remember: boolean) {
    const authData = this.buildRequestData(email, password);

    return this.http
      .post<AuthResponseData>(
        this.baseUrl +
          'accounts:signInWithPassword?key=' +
          environment.firebaseAPIKey,
        authData
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn,
            remember
          );
        })
      );
  }

  // changePassword(email: string) {
  //   console.log("resetPasswordInit", email);
  //   return this.http.post<{ requestType: string; email: string }>(
  //     this.baseUrl + 'accounts:update?key=' + environment.firebaseAPIKey,
  //     { requestType: 'PASSWORD_RESET', email: email }
  //   )
  //   .pipe(
  //     catchError(this.handleError),
  //     tap((response) => {
  //       console.log("resetPassword", response);
  //     }));
  // }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      remember: boolean;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);

    const userData: {
      email: string;
      id: string;
      remember: boolean;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));

    localStorage.removeItem('userData');
    localStorage.removeItem('userPreferences');

    const nextWeek = new Date();
    nextWeek.setDate(new Date().getDate() + 7);
    if (userData.remember) {
      localStorage.setItem(
        'userPreferences',
        JSON.stringify({
          email: userData.email,
          remember: userData.remember,
          expiration: nextWeek,
        })
      );
    }

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private buildRequestData(email: string, password: string): AuthRequestData {
    return {
      email: email,
      password: password,
      returnSecureToken: true,
    };
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number,
    remember: boolean
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000); //convert to milliseconds
    var storage = {
      email: email,
      id: userId,
      _token: token,
      _tokenExpirationDate: expirationDate,
      remember: remember,
    };
    localStorage.setItem('userData', JSON.stringify(storage));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(() => new Error(errorMessage));
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already!';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.';
        break;
    }
    return throwError(() => new Error(errorMessage));
  }

  getUserPreferences(): {
    email: string;
    remember: boolean;
  } | null {
    const userPref: {
      email: string;
      remember: boolean;
      expiration: string;
    } = JSON.parse(localStorage.getItem('userPreferences'));

    if (!userPref || new Date() > new Date(userPref.expiration)) {
      return;
    }
    return userPref;
  }
}
