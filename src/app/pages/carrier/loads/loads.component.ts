import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { switchMap } from 'rxjs';
import { Carrier } from 'src/app/model/carrier.model';
import { LoadRequest } from 'src/app/model/load-requests.model';
import { CarrierService } from 'src/app/service/carrier.service';
import { LoadRequestService } from 'src/app/service/load-request.service';

@Component({
  selector: 'app-loads',
  templateUrl: './loads.component.html',
  styleUrls: ['./loads.component.scss'],
  standalone: false
})
export class LoadsComponent  implements OnInit {

  carrierDataLogged: Carrier;
  allLoads: LoadRequest[] = [];
  filteredLoads: LoadRequest[] = [];
  filterText = '';

  constructor(
    private service: LoadRequestService,
    private carrierService: CarrierService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    //this.loadData();
  }

  ionViewWillEnter() {
    this.getInfoCarrier();
    this.loadData();
  }

  loadData() {
    const email = JSON.parse(sessionStorage.getItem('user'));

    this.carrierService.getByUsername(email).pipe(
      switchMap(carrier => {
        this.carrierDataLogged = carrier;
        return this.service.findByStatusPublished();
      }))
      .subscribe(loads => {
        this.allLoads = loads.map(l => ({
          ...l,
          alreadyRequested: l.requests.some(r => r.carrier.id === this.carrierDataLogged.id)
        }));
        this.applyFilter();
    });
    
    // this.service.findByStatusPublished().subscribe({
    //   next: loads => {
    //     this.allLoads = loads.map(l => ({
    //       ...l,
    //       alreadyRequested: l.requests.some(r => r.carrier.id === this.carrierDataLogged.id)
    //     }));
    //     this.applyFilter();
    //   }
    // });
  }

  applyFilter() {
    const term = this.filterText.trim().toLowerCase();
    this.filteredLoads = term
      ? this.allLoads.filter(l =>
          l.origin.toLowerCase().includes(term) ||
          l.destination.toLowerCase().includes(term) ||
          l.weight.toLowerCase().includes(term)
        )
      : [...this.allLoads];
  }

  onReview(load: LoadRequest & { alreadyRequested?: boolean }) {
    if (load.alreadyRequested) {
      return; // por seguridad, no navegamos
    }
    this.navCtrl.navigateForward(['/pages/review-load', load.id]);
  }

  reload() {
    this.loadData();
  }

  getInfoCarrier()
  {
    const email = JSON.parse(sessionStorage.getItem('user'));
    if (email) {
      this.carrierService.getByUsername(email).subscribe({
        next: (carrier: Carrier) => {
          this.carrierDataLogged = carrier;
        }
      });
    }
  }
}
