import { Injectable } from '@angular/core';
import { LoadRequest } from '../model/load-requests.model';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoadRequestService extends GenericService<LoadRequest> {

  constructor(protected override http: HttpClient){
    super(http, `${environment.HOST}/loadrequests`)
  }

  findByStatusPublished() {
    return this.http.get<LoadRequest[]>(`${this.url}/status/published`);
  }

  findByClientUsername(username: string){
    return this.http.get<LoadRequest[]>(`${this.url}/client/username`, {
      params: { username: username }
    });
  }

  findByCarrierUsername(username: string){
    return this.http.get<LoadRequest[]>(`${this.url}/carrier/username`, {
      params: { username: username }
    });
  }

  findStatus()
  {
    return this.http.get<string[]>(`${this.url}/status`);
  }
}
