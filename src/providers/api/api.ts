import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Storage} from "@ionic/storage";
import {JwtHelperService} from "@auth0/angular-jwt";

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {
  url: string = 'http://localhost:8765';
  private jwtTokenName = 'jwt_token';
  header: HttpHeaders = new HttpHeaders();

  constructor(public http: HttpClient,
              private readonly storage: Storage,
              private readonly jwtHelper: JwtHelperService) {
    this.displayHeaders();

  }

  displayHeaders(){
   this.header.append('Content-Type', 'application/json; charset=utf-8');
   this.checkLogin();
  }

  get(endpoint: string, params?: any, reqOpts?: any) {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams()
      };
    }

    // Support easy query params for GET requests
    if (params) {
      reqOpts.params = new HttpParams();
      for (let k in params) {
        reqOpts.params.set(k, params[k]);
      }
    }

    return this.http.get(this.url + '/' + endpoint, reqOpts);
  }

  post(endpoint: string, body: any, reqOpts?: any) {
    return this.http.post(this.url + '/' + endpoint, body, reqOpts);
  }

  put(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.url + '/' + endpoint, body, reqOpts);
  }

  delete(endpoint: string, reqOpts?: any) {
    return this.http.delete(this.url + '/' + endpoint, reqOpts);
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.url + '/' + endpoint, body, reqOpts);
  }

  checkLogin() {
    this.storage.get(this.jwtTokenName).then(jwt => {
      if (jwt && !this.jwtHelper.isTokenExpired(jwt)) {
        this.header.append('Authorization', jwt);
      }
      else {
        this.storage.remove(this.jwtTokenName);
      }
    });
}

}
