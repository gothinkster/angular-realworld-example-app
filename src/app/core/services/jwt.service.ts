import { Inject, Injectable } from '@angular/core';
import { WINDOW } from '../models/injectable-tokens';

@Injectable()
export class JwtService {

  constructor(@Inject(WINDOW) private window) {}

  getToken(): string {
    return this.window.localStorage['jwtToken'];
  }

  saveToken(token: string) {
    this.window.localStorage['jwtToken'] = token;
  }

  destroyToken() {
    this.window.localStorage.removeItem('jwtToken');
  }

}
