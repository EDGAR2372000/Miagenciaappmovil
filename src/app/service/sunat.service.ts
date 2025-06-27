import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SunatService {

  constructor(
    private http: HttpClient
  ) { }

  consultRuc(ruc: string) {
    return this.http.get<any>(`${environment.HOST}/sunat/consult-ruc`, {
      params: { ruc: ruc }
    });
  }
}
