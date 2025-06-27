import { Component, OnInit } from '@angular/core';
import { CarrierService } from 'src/app/service/carrier.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false
})
export class DashboardComponent  implements OnInit {

  company: string = '';

  constructor(
    private carrierService: CarrierService, // Assuming you have a CarrierService to fetch data
  ) { }

  ngOnInit() {
    this.getCarrierByUsername();
  }

  getCarrierByUsername() {
    const username = JSON.parse(sessionStorage.getItem('user'));
    this.carrierService.getByUsername(username).subscribe((data: any) => {
      this.company = data?.nameCompany;
    });
  }

}
