import { Injectable } from '@angular/core';
import { Carrier } from '../model/carrier.model';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarrierService extends GenericService<Carrier> {

  constructor(protected override http: HttpClient){
    super(http, `${environment.HOST}/carriers`)
  }

  getByUsername(email: string) {
    return this.http.get<Carrier>(`${this.url}/by-username/${email}`);
  }
}
