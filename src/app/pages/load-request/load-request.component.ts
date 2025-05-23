import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { LoadRequest } from 'src/app/model/load-requests.model';
import { LoadRequestService } from 'src/app/service/load-request.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-load-request',
  templateUrl: './load-request.component.html',
  styleUrls: ['./load-request.component.scss'],
  standalone: false
})
export class LoadRequestComponent  implements OnInit {

  pendingCount = 0;
  allRequests: LoadRequest[] = [];
  filteredRequests: LoadRequest[] = [];
  filterText: string = '';

  constructor(
    private loadRequestService: LoadRequestService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    this.loadData();
    this.loadPendingCount();
  }

  ionViewWillEnter() {
    this.loadData();
    this.loadPendingCount();
  }

  loadData() {
    this.loadRequestService.findAll().subscribe( data => {
      this.allRequests = data;
      this.filteredRequests = [...this.allRequests];
    } );
  }

  applyFilter() {
    const term = this.filterText.trim().toLowerCase();
    if (!term) {
      this.filteredRequests = [...this.allRequests];
    } else {
      this.filteredRequests = this.allRequests.filter(r =>
        r.origin.toLowerCase().includes(term) ||
        r.destination.toLowerCase().includes(term) ||
        r.status.toLowerCase().includes(term)
      );
    }
  }

  onCreate() {
    this.navCtrl.navigateForward('/pages/load-requests/create');
  }

  onEdit(request: LoadRequest) {
    this.navCtrl.navigateForward(`/pages/load-requests/edit/${request.id}`);
  }

  async onDelete(request: LoadRequest) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: '¿Deseas eliminar esta solicitud? N°operation: ' + request.operation + '?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          cssClass: 'delete-button',
          handler: () => {
            this.loadRequestService.delete(request.id).subscribe(data => {
              this.loadData();
              this.notification.showSuccess('Solicitud eliminada.');
            });
          }
        }
      ]
    });
  
    await alert.present();
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
  
  loadPendingCount() {
    this.pendingCount = 2;
  }

  goToNotifications() {

  }
}
