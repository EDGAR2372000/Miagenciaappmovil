import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Client } from '../model/client.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService extends GenericService<Client> {

  constructor(protected override http: HttpClient){
    super(http, `${environment.HOST}/clients`)
  }

  getByUsername(email: string) {
    return this.http.get<Client>(`${this.url}/by-username/${email}`);
  }
}
