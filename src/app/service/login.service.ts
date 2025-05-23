import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { JwtRequest } from '../model/jwt-request.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private url: string = `${environment.HOST}/login`;
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(username: string, password: string) {
    const body: JwtRequest = { username, password };
    return this.http.post<any>(this.url, body);
  }
}
