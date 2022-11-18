import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppConfigService } from '@app/app.config';
import { Login } from '@app/shared/models/Login';
import { OAuthService } from 'angular-oauth2-oidc';
import { Cookie } from 'ng2-cookies';
import { BehaviorSubject } from 'rxjs';
import { CenturaConstants } from '../util/CenturaConstants';
import { CenturaInitService } from './centura-init.service';

@Injectable({
  providedIn: 'root',
})
export class CenturaAuthenticationService {
  private _CLIENT_ID = 'CPA';
  private _CLIENT_SECRET = '123';
  protected apiServer;

  constructor(
    private router: Router,
    private oauthService: OAuthService,
    private centuraInitService: CenturaInitService
  ) {
    this.apiServer = AppConfigService.settings.apiServer;
  }

  // Added for dummy login, original loginAuthenticate method commented out
  private readonly _storage$$ = new BehaviorSubject<string>('');

  loginAuthenticate(loginData: Login): Promise<any> {
    sessionStorage.setItem('username', loginData.userName);
    this._storage$$.next(sessionStorage.getItem('username')!);
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 500);
    });
  }

  isUserLoggedIn() {
    let userName = sessionStorage.getItem('username');
    if (userName) {
      this._storage$$.next(userName);
      return true;
    } else return false;
  }

  watchStorage() {
    return this._storage$$.asObservable();
  }

  logout() {
    sessionStorage.setItem('username', null);
    this.navigateNotAuthenticatedUser();
  }
  // dummy login ends here

  // loginAuthenticate(loginData: Login): Promise<any> {
  // const loginConfig = {
  //   issuer: this.apiServer.baseUrl + 'oauth',
  //   loginUrl: this.apiServer.baseUrl + 'oauth/token',
  //   tokenEndpoint: this.apiServer.baseUrl + 'oauth/token',
  //   clientId: this._CLIENT_ID,
  //   requireHttps: false,
  //   dummyClientSecret: this._CLIENT_SECRET,
  //   useHttpBasicAuth: true,
  //   scope: 'read write',
  // };

  // const loginFunction = function (
  //   oauthService: OAuthService,
  //   loginConfig: AuthConfig,
  //   loginData: Login,
  //   saveLoginToken: Function
  // ): Promise<any> {
  //   return new Promise(function (resolve, reject) {
  //     oauthService.configure(loginConfig);
  //     oauthService
  //       .fetchTokenUsingPasswordFlow(loginData.userName, loginData.password)
  //       .then((resp) => {
  //         if (oauthService.hasValidAccessToken()) {
  //           saveLoginToken(oauthService);
  //         }
  //         // resolve();
  //       })
  //       .catch(function (error) {
  //         reject(error);
  //       });
  //   });
  // };

  // return loginFunction(this.oauthService, loginConfig, loginData, this.saveLoginToken);
  // }

  pingAuthenticate(): void {
    const pingConfig = {
      issuer: 'https://idp-d.rbinternational.com',
      loginUrl: 'https://idp-d.rbinternational.com/as/authorization.oauth2',
      logoutUrl: 'https://idp-d.rbinternational.com/as/revoke_token.oauth2',
      redirectUri: this.centuraInitService.getCenturaInit().originAddress,
      clientId: this._CLIENT_ID,
      requireHttps: true,
      responseType: 'id_token',
      scope: 'openid profile email',
      showDebugInformation: true,
      requestAccessToken: false,
      oidc: true,
    };
    console.log('GroupCpaAuthenticationService' + this.centuraInitService.getCenturaInit().originAddress);
    this.oauthService.configure(pingConfig);
    this.oauthService.initImplicitFlow();
  }

  savePingToken(token: any) {
    const encodedToken = this.parseJwt(token);
    const expireDate = 1000 * encodedToken.exp;
    Cookie.set(CenturaConstants.TOKEN_NAME, token);
    Cookie.set(CenturaConstants.TOKEN_EXPIRATION, expireDate + '');
    console.log('GroupCpaAuthenticationService -' + new Date(expireDate));
    this.navigateAuthenticatedUser();
  }

  saveLoginToken(oauthService: OAuthService) {
    Cookie.set(CenturaConstants.TOKEN_NAME, oauthService.getAccessToken());
    Cookie.set(CenturaConstants.TOKEN_EXPIRATION, oauthService.getAccessTokenExpiration() + '');
    console.log('GroupCpaAuthenticationService -' + new Date(oauthService.getAccessTokenExpiration()));
  }

  navigateAuthenticatedUser() {
    this.router.navigate(['home']);
  }

  navigateNotAuthenticatedUser() {
    this.router.navigate(['login']);
  }

  parseJwt(token: any) {
    if (!token) {
      return;
    }
    const base64Url = token.split('.')[1];
    if (!base64Url) {
      return JSON.parse('{ "name": "Token is of bad format!" }');
    }
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }
}
