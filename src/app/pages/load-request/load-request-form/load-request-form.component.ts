import { ClientService } from './../../../service/client.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { switchMap } from 'rxjs';
import { LoadRequest } from 'src/app/model/load-requests.model';
import { LoadRequestService } from 'src/app/service/load-request.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-load-request-form',
  templateUrl: './load-request-form.component.html',
  styleUrls: ['./load-request-form.component.scss'],
  standalone: false
})
export class LoadRequestFormComponent  implements OnInit {

  clientFullName: string = '';
  id: number;
  isEdit: boolean;
  form: FormGroup;
  action: string = '';
  
  constructor(
    private fb: FormBuilder,
    private loadRequestService: LoadRequestService,
    private clientService: ClientService,
    private router: Router,
    private notification: NotificationService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      origin: ['', Validators.required],
      destination: ['', Validators.required],
      loadDetails: ['', Validators.required],
      weight: ['', Validators.required],
     // operation: ['', Validators.required],
      tariff: [null, [Validators.required, Validators.min(0), Validators.max(999)]],
     // datetime: [new Date().toISOString(), Validators.required],
      client: []
    //  status: ['PENDING', Validators.required],
    });

    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
      this.action = this.isEdit ? 'Editar' : 'Crear';
    })
  }

  initForm()
  {
    if (this.isEdit) {

      this.loadRequestService.findById(this.id).subscribe(data => {
        this.form = this.fb.group({
          id: [data.id],
          origin: [data.origin, Validators.required],
          destination: [data.destination, Validators.required],
          loadDetails: [data.loadDetails, Validators.required],
          weight: [data.weight, Validators.required],
          operation: [data.operation, Validators.required],
          tariff: [data.tariff, [Validators.required, Validators.min(0), Validators.max(999)]],
          datetime: [data.datetime, Validators.required],
          client: [data.client],
          status: [data.status, Validators.required],
        });
        this.clientFullName = data.client.fullName;
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    if(this.isEdit){
      this.update();
    }else{
      this.save();
    }
  }

  save()
  {
    const obj = new LoadRequest();
    obj.origin = this.form.get('origin').value;
    obj.destination = this.form.get('destination').value;
    obj.loadDetails = this.form.get('loadDetails').value;
    obj.weight = this.form.get('weight').value;
    obj.tariff = this.form.get('tariff').value;

    const email = JSON.parse(sessionStorage.getItem('user'));
    this.clientService.getByUsername(email).pipe(
      switchMap(clientData => {
        obj.client = clientData;
        return this.loadRequestService.save(obj);
      })
    ).subscribe({
      next: () => {
        this.notification.showSuccess('Solicitud de Carga creada.');
        this.router.navigate(['/pages/loads-requests']);
      }
    });
  }

  update()
  {
    const obj = new LoadRequest();
    obj.id = this.form.get('id').value;
    obj.origin = this.form.get('origin').value;
    obj.destination = this.form.get('destination').value;
    obj.loadDetails = this.form.get('loadDetails').value;
    obj.weight = this.form.get('weight').value;
    obj.tariff = this.form.get('tariff').value;
    obj.operation = this.form.get('operation').value;
    obj.datetime = this.form.get('datetime').value;
    obj.client = this.form.get('client').value;
    obj.status = this.form.get('status').value;

    this.loadRequestService.update(obj.id, obj).subscribe({
      next: () => {
        this.notification.showSuccess('Solicitud de Carga actualizada.');
        this.router.navigate(['/pages/loads-requests']);
      }
    });
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

  formatTariff() {
    const ctrl = this.form.get('tariff');
    if (!ctrl) return;
    const raw = ctrl.value;
    if (raw === null || raw === '') return;

    const num = parseFloat(raw);
    if (isNaN(num)) {
      ctrl.setValue(null);
    } else {
      // este setValue disparará que el ion-input muestre "100.00"
      ctrl.setValue(num.toFixed(2), { emitEvent: false });
    }
  }
}
