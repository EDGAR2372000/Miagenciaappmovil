import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReniecService {

  constructor(
    private http: HttpClient
  ) { }

  consultDni(dni: string) {
    return this.http.get<any>(`${environment.HOST}/reniec/consult-dni`, {
      params: { dni: dni }
    });
  }
}
