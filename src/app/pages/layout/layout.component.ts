import { Component, OnInit } from '@angular/core';
import { Menu } from 'src/app/model/menu.model';
import { MenuService } from 'src/app/service/menu.service';


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  standalone: false,
})
export class LayoutComponent  implements OnInit {

  isLoggedIn: boolean = true;
  menus : Menu[] = [];
  
  constructor(
    private menuService: MenuService,
  ) { }

  ngOnInit() {
    this.loadMenus();
  }

  loadMenus()
  {
    const username = JSON.parse(sessionStorage.getItem('user'));
    console.log(username);
    this.menuService.getMenuByRole(username).subscribe({
      next: (response) => {
        this.menus = response;
      }
    });
  }

  logout()
  {
    
  }
}
