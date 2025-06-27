import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
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
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.loadMenus();
  }

  loadMenus()
  {
    const username = JSON.parse(sessionStorage.getItem('user'));
    this.menuService.getMenuByRole(username).subscribe({
      next: (response) => {
        this.menus = response;
      }
    });
  }

  logout()
  {
    sessionStorage.clear();
    window.location.href = '/';
    // this.navCtrl.navigateForward('/auth/login');
  }
}
