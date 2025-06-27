import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { switchMap } from 'rxjs';
import { LoadRequest } from 'src/app/model/load-requests.model';
import { Request } from 'src/app/model/request.model';
import { CarrierService } from 'src/app/service/carrier.service';
import { LoadRequestService } from 'src/app/service/load-request.service';
import { NotificationService } from 'src/app/service/notification.service';
import { RequestService } from 'src/app/service/request.service';

@Component({
  selector: 'app-review-load',
  templateUrl: './review-load.component.html',
  styleUrls: ['./review-load.component.scss'],
  standalone: false
})
export class ReviewLoadComponent  implements OnInit {

  load: LoadRequest;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private fb: FormBuilder,
    private loadService: LoadRequestService,
    private requestService: RequestService,
    private carrierService: CarrierService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.loadService.findById(+id!).subscribe(load => {
      this.load = load;
    });

    this.form = this.fb.group({
      suggestedPrice: [null],
    });
  }

  formatPrice() {
    const ctrl = this.form.get('suggestedPrice');
    if (!ctrl) return;
    const v = parseFloat(ctrl.value);
    if (!isNaN(v)) {
      ctrl.setValue(v.toFixed(2), { emitEvent: false });
    }
  }

  statusColor(status: string): string {
    switch (status) {
      case 'PUBLICADO':
        return 'primary';    // Publicado: color destacado
      case 'ASIGNADO':
        return 'warning';    // Asignado: atención
      case 'RECOGIDO':
        return 'secondary';  // Recogido: intermedio
      case 'RUTA':
        return 'success';    // En ruta: éxito/avance
      case 'COMPLETADO':
        return 'tertiary';   // Completado: neutro
      default:
        return 'medium';     // Por defecto
    }
  }

  /** Envía la Request al backend */
  onSubmit() {
    const request = new Request();
    request.suggestedPrice = parseFloat(this.form.get('suggestedPrice')?.value);
    request.loadRequest = this.load;

    const email = JSON.parse(sessionStorage.getItem('user'));
    this.carrierService.getByUsername(email).pipe(
      switchMap(data => {
        request.carrier = data;
        return this.requestService.save(request);
      })
    ).subscribe({
      next: () => {
        this.notificationService.showSuccess('Solicitud enviada.');
        this.navCtrl.navigateRoot('/pages/loads');
      }
    });

    // this.requestService.save(request).subscribe({
    //   next: (res) => {
    //     this.notificationService.showSuccess('Solicitud enviada.');
    //     this.navCtrl.navigateRoot('/pages/loads');
    //   }
    // });
  }
}
