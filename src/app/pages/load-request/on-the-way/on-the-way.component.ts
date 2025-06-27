import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadRequest } from 'src/app/model/load-requests.model';
import { LoadRequestService } from 'src/app/service/load-request.service';

interface Status {
  key: string;
  label: string;
  icon?: string;
}

@Component({
  selector: 'app-on-the-way',
  templateUrl: './on-the-way.component.html',
  styleUrls: ['./on-the-way.component.scss'],
  standalone: false
})
export class OnTheWayComponent  implements OnInit {

  id: number;
  request: LoadRequest;
  statuses: Status[] = [];
  currentStatus: string = '';

  constructor(private service: LoadRequestService,
    private route: ActivatedRoute
  ){

  }
  ngOnInit(): void {
    // Datos estáticos (puedes reemplazar con valores reales del backend)
    this.statuses = [
      { key: 'PUBLICADO', label: 'Publicado', icon: 'cloud-upload-outline' },
      { key: 'ASIGNADO', label: 'Asignado', icon: 'person-outline' },
      { key: 'RECOGIDO', label: 'Recogido', icon: 'cube-outline' },
      { key: 'RUTA', label: 'En Ruta', icon: 'car-outline' },
      { key: 'COMPLETADO', label: 'Entregado', icon: 'checkmark-done-outline' }
    ];

   this.loadRequest();
  }

  loadRequest()
  {
    this.route.params.subscribe(params => {
      this.service.findById(params['id']).subscribe(data => {
        this.request = data;
        this.currentStatus = data.status;
      })
    })
  }

  getColor(status: string): string {
    switch (status) {
      case 'PUBLICADO': return '#3B82F6';
      case 'ASIGNADO': return '#F59E0B';
      case 'RECOGIDO': return '#6B7280';
      case 'RUTA': return '#10B981';
      case 'COMPLETADO': return '#8B5CF6';
      default: return '#ccc';
    }
  }

  private currentIndex(): number {
    return this.statuses.findIndex(s => s.key === this.currentStatus);
  }

  isDone(index: number): boolean {
    return index < this.currentIndex();
  }

  isCurrent(index: number): boolean {
    return index === this.currentIndex();
  }
}
