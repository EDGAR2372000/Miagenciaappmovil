import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Menu } from '../model/menu.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuService extends GenericService<Menu> {

  constructor(protected override http: HttpClient){
    super(http, `${environment.HOST}/menus`)
  }

  getMenuByRole(username: string) {
    return this.http.get<Menu[]>(`${this.url}/user/${username}`);
  }

}
