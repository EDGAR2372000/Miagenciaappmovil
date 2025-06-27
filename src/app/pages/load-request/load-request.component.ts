import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { LoadRequest } from 'src/app/model/load-requests.model';
import { LoadRequestService } from 'src/app/service/load-request.service';
import { NotificationService } from 'src/app/service/notification.service';

interface LoadRequestWithPending extends LoadRequest {
  pendingRequestsCount: number;
}

@Component({
  selector: 'app-load-request',
  templateUrl: './load-request.component.html',
  styleUrls: ['./load-request.component.scss'],
  standalone: false
})
export class LoadRequestComponent implements OnInit, OnDestroy {
  pendingCount = 0;

  // Usamos la interfaz que agrega el conteo de pendientes
  allRequests: LoadRequestWithPending[] = [];
  filteredRequests: LoadRequestWithPending[] = [];
  allRequestsWithPending: LoadRequestWithPending[] = [];
  filterText = '';
  isViewingPending = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private loadRequestService: LoadRequestService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  ionViewWillEnter() {
    this.loadData();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

 loadData() {
  const username = JSON.parse(sessionStorage.getItem('user'));
    const sub = this.loadRequestService.findByClientUsername(username).subscribe({
      next: data => {
        // 1) Mapeamos cada LoadRequest para calcular cuántos Request están en PENDIENTE
        this.allRequests = (data || []).map(lr => {
          const pendingCount = lr.requests
            ? lr.requests.filter(r => r.status === 'PENDIENTE').length
            : 0;
          return {
            ...lr,
            pendingRequestsCount: pendingCount
          };
        });

        // 2) Filtramos los que tienen al menos una solicitud pendiente
        this.allRequestsWithPending = this.allRequests.filter(lr => lr.pendingRequestsCount > 0);

        // 3) El badge de notificaciones muestra la cantidad de LoadRequests con pendientes
        this.pendingCount = this.allRequestsWithPending.length;

        // 4) Inicialmente mostramos la lista completa
        this.filteredRequests = this.isViewingPending
          ? [...this.allRequestsWithPending]
          : [...this.allRequests];
      },
      error: err => {
        console.error('Error cargando LoadRequests:', err);
        this.notification.showError('Error al cargar solicitudes.');
      }
    });

    this.subscriptions.push(sub);
  }

  applyFilter() {
    const term = this.filterText.trim().toLowerCase();
    const sourceList = this.isViewingPending
      ? this.allRequestsWithPending
      : this.allRequests;

    if (!term) {
      this.filteredRequests = [...sourceList];
    } else {
      this.filteredRequests = sourceList.filter(r =>
        r.origin.toLowerCase().includes(term) ||
        r.destination.toLowerCase().includes(term) ||
        r.status.toLowerCase().includes(term) ||
        r.operation.toLowerCase().includes(term)
      );
    }
  }

  onCreate() {
    this.navCtrl.navigateForward('/pages/load-requests/create');
  }

  onEdit(request: LoadRequestWithPending) {
    this.navCtrl.navigateForward(`/pages/load-requests/edit/${request.id}`);
  }

  onReview(request: LoadRequestWithPending) {
    this.navCtrl.navigateForward(`/pages/review-load-request/${request.id}`);
  }

  async onDelete(request: LoadRequestWithPending) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: `¿Deseas eliminar esta solicitud? N° operación: ${request.operation}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.loadRequestService.delete(request.id).subscribe({
              next: () => {
                this.notification.showSuccess('Solicitud eliminada.');
                this.loadData();
              },
              error: () => {
                this.notification.showError('No se pudo eliminar.');
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }

  statusColor(status: string): string {
    switch (status) {
      case 'PUBLICADO': return 'primary';
      case 'ASIGNADO':   return 'warning';
      case 'RECOGIDO':   return 'secondary';
      case 'RUTA':       return 'success';
      case 'COMPLETADO': return 'tertiary';
      default:           return 'medium';
    }
  }

  goToNotifications() {
    this.isViewingPending = !this.isViewingPending;
    this.filterText = '';
    this.filteredRequests = this.isViewingPending
      ? [...this.allRequestsWithPending]
      : [...this.allRequests];
  }

  goToTracking(req: LoadRequestWithPending){
    this.navCtrl.navigateForward(`/pages/tracking/${req.id}`);
  }
}
