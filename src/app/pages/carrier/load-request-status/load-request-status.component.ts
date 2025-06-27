import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { LoadRequest } from 'src/app/model/load-requests.model';
import { LoadRequestService } from 'src/app/service/load-request.service';
import { NotificationService } from 'src/app/service/notification.service';

interface LoadRequestWithPending extends LoadRequest {
  pendingRequestsCount: number;
}

@Component({
  selector: 'app-load-request-status',
  templateUrl: './load-request-status.component.html',
  styleUrls: ['./load-request-status.component.scss'],
  standalone: false
})
export class LoadRequestStatusComponent  implements OnInit {

  pendingCount = 0;

  allRequests: LoadRequestWithPending[] = [];
  filteredRequests: LoadRequestWithPending[] = [];
  allRequestsWithPending: LoadRequestWithPending[] = [];
  filterText = '';
  isViewingAssigned = false;
  allAssignedRequests: LoadRequestWithPending[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    private loadRequestService: LoadRequestService,
    private navCtrl: NavController,
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
  const sub = this.loadRequestService.findByCarrierUsername(username).subscribe({
    next: data => {
      this.allRequests = (data || []).map(lr => {
        const pendingCount = lr.requests
          ? lr.requests.filter(r => r.status !== 'PUBLICADO').length
          : 0;
        return {
          ...lr,
          pendingRequestsCount: pendingCount
        };
      });

      // 1) Filtrado “pendientes” (tienes ya this.allRequestsWithPending)
      this.allRequestsWithPending = this.allRequests.filter(lr => lr.pendingRequestsCount > 0);

      // 2) Filtrado “asignadas”
      this.allAssignedRequests = this.allRequests.filter(lr => lr.status === 'ASIGNADO');

      // 3) Cuenta de asignadas
      this.pendingCount = this.allAssignedRequests.length;

      // 4) Elige la lista inicial según el flag
      this.filteredRequests = this.isViewingAssigned
        ? [...this.allAssignedRequests]
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
  const sourceList = this.isViewingAssigned
    ? this.allAssignedRequests
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

  toggleAssignedView() {
    this.isViewingAssigned = !this.isViewingAssigned;
    this.filterText = '';
    this.filteredRequests = this.isViewingAssigned
      ? [...this.allAssignedRequests]
      : [...this.allRequests];
  }
}
