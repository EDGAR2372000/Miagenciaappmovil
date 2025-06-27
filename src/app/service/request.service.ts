import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Request } from '../model/request.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CloudinaryRecord } from '../model/cloudinary.model';

@Injectable({
  providedIn: 'root'
})
export class RequestService extends GenericService<Request>{

  constructor(protected override http: HttpClient){
    super(http, `${environment.HOST}/requests`)
  }

  saveFile(data: File){
    const formdata: FormData = new FormData();
    formdata.append('file', data);

    /*const patientBlob = new Blob([JSON.stringify(patient)], { type: "application/json" });
    formdata.append('patient', patientBlob)*/

    return this.http.post<CloudinaryRecord>(`${this.url}/saveFile`, formdata);
  }
}
