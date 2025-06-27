import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadRequest } from 'src/app/model/load-requests.model';
import { LoadRequestService } from 'src/app/service/load-request.service';
import { NotificationService } from 'src/app/service/notification.service';
import { RequestService } from 'src/app/service/request.service';
import { Request } from 'src/app/model/request.model';
import { ModalController, NavController } from '@ionic/angular';
import { DialogPaymentComponent } from '../dialog-payment/dialog-payment.component';
import { switchMap } from 'rxjs';
import { PhotoviewerComponent } from '../photoviewer/photoviewer.component';
import { LoaderService } from 'src/app/service/loader.service';

@Component({
  selector: 'app-review-load-request',
  templateUrl: './review-load-request.component.html',
  styleUrls: ['./review-load-request.component.scss'],
  standalone: false
})
export class ReviewLoadRequestComponent  implements OnInit {

  load!: LoadRequest;
  requests: Request[] = [];

  constructor(
    private route: ActivatedRoute,
    private loadService: LoadRequestService,
    private requestService: RequestService,
    private notificationService: NotificationService,
    public loaderService: LoaderService,
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadService.findById(id).subscribe(load => {
      this.load = load;
      this.requests = load.requests || [];
    });
  }

  badgeColor(status: string): string {
    switch (status) {
      case 'PENDIENTE': return 'warning';
      case 'ACEPTADO': return 'success';
      case 'RECHAZADO': return 'danger';
      default: return 'medium';
    }
  }

  async onChangeStatus(req: Request, newStatus: 'ACEPTADO' | 'RECHAZADO') {
    /*const request = new Request();
    request.id = req.id;
    request.suggestedPrice = req.suggestedPrice;
    request.loadRequest = this.load;
    request.status = newStatus;

    request.carrier = req.carrier;

    this.requestService.update(request.id, request).subscribe({
      next: () => {
        this.notificationService.showSuccess(`Solicitud ${newStatus.toLowerCase()} correctamente`);
        req.status = newStatus;
        this.navCtrl.back();
      },
    });*/

    if (newStatus === 'ACEPTADO') {
      // 1) abrir modal de pago
      const modal = await this.modalCtrl.create({
        component: DialogPaymentComponent,
        componentProps: {
          accountNumber: req.carrier.accountNumber,
          interbankCode: req.carrier.interbankCode,
          bankName: req.carrier.bankName,
          companyName: req.carrier.nameCompany
        }
      });
      await modal.present();
  
      const { data } = await modal.onWillDismiss();
      if (!data) {
        return; // el usuario cerró o no subió
      }
  
      // 2) armar FormData con la info del request + el comprobante
      // const formData = new FormData();
      // formData.append('requestId', String(req.id));
      // formData.append('status', 'ACEPTADO');
      // formData.append('paymentProof', data.file, data.file.name);
  
      // 3) enviar al backend
      // this.requestService.saveFile(data.file).pipe(
      //   switchMap((response) => {
      //     console.log('Comprobante subido:', response);
      //     const request = new Request();
      //     request.id = req.id;
      //     request.suggestedPrice = req.suggestedPrice;
      //     request.loadRequest = this.load;
      //     request.status = 'ACEPTADO';
      //     request.carrier = req.carrier;
      //     request.urlPhotoPay = response.urlPhotoPay; 
      //     return this.requestService.update(request.id, request);
      //   })
      // ).subscribe({
      //   next: () => {
      //     this.notificationService.showSuccess(`Solicitud ${newStatus.toLowerCase()} correctamente`);
      //     req.status = 'ACEPTADO';
      //     this.navCtrl.back();
      //   }
      // });
          const request = new Request();
          request.id = req.id;
          request.suggestedPrice = req.suggestedPrice;
          request.loadRequest = this.load;
          request.status = 'ACEPTADO';
          request.carrier = req.carrier;
          request.paid = data.paid;
          console.log('Comprobante subido:', data.paid);
      this.requestService.update(request.id, request).subscribe({
        next: () => {
          this.notificationService.showSuccess(`Solicitud ${newStatus.toLowerCase()} correctamente`);
          req.status = newStatus;
          this.navCtrl.back();
        },
      });
    } else {
      const request = new Request();
      request.id = req.id;
      request.suggestedPrice = req.suggestedPrice;
      request.loadRequest = this.load;
      request.status = newStatus;
  
      request.carrier = req.carrier;
      request.paid = false; // No se paga si se rechaza

      this.requestService.update(request.id, request).subscribe({
        next: () => {
          this.notificationService.showSuccess(`Solicitud ${newStatus.toLowerCase()} correctamente`);
          req.status = newStatus;
          this.navCtrl.back();
        },
      });
    }
  }

  async viewProof(url: string) {
    // Opción 1: abrir en nueva ventana
    // window.open(url, '_blank');

    // Opción 2: abrir en modal con un componente PhotoViewerComponent
    
    const modal = await this.modalCtrl.create({
      component: PhotoviewerComponent,
      componentProps: { photoUrl: url }
    });
    await modal.present();
    
  }
}
