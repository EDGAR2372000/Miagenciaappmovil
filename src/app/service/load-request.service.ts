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
}
