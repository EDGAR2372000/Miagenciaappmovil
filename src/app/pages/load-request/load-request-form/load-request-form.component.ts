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
  isCarrier: boolean = false;
  loadRequest: LoadRequest = new LoadRequest();
  statusOptions : string[] = [];

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
    this.isCarrier = JSON.parse(sessionStorage.getItem('role')) === '[TRANSPORTISTA]';
    this.form = this.fb.group({
      id:          [],
      origin:      ['', Validators.required],
      destination: ['', Validators.required],
      loadDetails: ['', Validators.required],
      weight:      ['',     [
        Validators.required,
        Validators.pattern(/^\d+(\.\d+)?\s?(KG|LB|TON)$/i)
      ]],
      tariff:      [null, [Validators.required, Validators.min(0), Validators.max(9999)]],
      operation:   [''],
      datetime:    [''],
      client:      [''],
      status:      [''], 
    });
  
    if (this.isCarrier) {
      ['origin','destination','loadDetails','weight','tariff','operation','datetime','client']
        .forEach(ctrl => this.form.get(ctrl)?.disable());
    }
  
    this.findStatus();
  
    this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.isEdit = !!params['id'];
      this.action = this.isEdit ? 'Editar' : 'Crear';
  
      if (this.isEdit) {
        this.loadRequestService.findById(this.id).subscribe(data => {
          this.loadRequest = data;
          this.clientFullName = data.client.fullName;
          this.form.patchValue({
            id:          data.id,
            origin:      data.origin,
            destination: data.destination,
            loadDetails: data.loadDetails,
            weight:      data.weight,
            tariff:      data.tariff,
            operation:   data.operation,
            datetime:    data.datetime,
            client:      data.client,
            status:      data.status
          });
        });
      }
    });
  }

  // initForm()
  // {

  //   if (this.isEdit) {
  //     this.loadRequestService.findById(this.id).subscribe(data => {
  //       this.loadRequest = data;
  //       if(this.isCarrier == false)
  //       {
  //         this.form = this.fb.group({
  //           id: [data.id],
  //           origin: [data.origin, Validators.required],
  //           destination: [data.destination, Validators.required],
  //           loadDetails: [data.loadDetails, Validators.required],
  //           weight: [data.weight, Validators.required],
  //           operation: [data.operation, Validators.required],
  //           tariff: [data.tariff, [Validators.required, Validators.min(0), Validators.max(999)]],
  //           datetime: [data.datetime, Validators.required],
  //           client: [data.client],
  //           status: [data.status, Validators.required],
  //         });
  //       }else{
  //         this.form = this.fb.group({
  //           id: [data.id],
  //           origin: [{ value: data.origin, disabled: this.isCarrier }],
  //           destination: [{ value: data.destination, disabled: this.isCarrier }],
  //           loadDetails: [{ value: data.loadDetails, disabled: this.isCarrier }],
  //           weight: [{ value: data.weight, disabled: this.isCarrier }],
  //           tariff: [{ value: data.tariff, disabled: this.isCarrier }],
  //           operation: [{value: data.operation, disabled: this.isCarrier}], // si lo necesitas
  //           datetime: [{value: data.datetime, disabled: this.isCarrier}],
  //           client: [{value: data.client, disabled: this.isCarrier}],
  //           status: [data.status, Validators.required],
  //         });
  //       }
  //       this.clientFullName = data.client.fullName;
  //     });
  //   }
  // }

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
    obj.status = this.form.getRawValue().status;
    obj.carrier = this.loadRequest.carrier;
    obj.requests = this.loadRequest.requests;


    this.loadRequestService.update(obj.id, obj).subscribe({
      next: () => {
        this.notification.showSuccess('Solicitud de Carga actualizada.');
        if(this.isCarrier)
        {
          this.router.navigate(['/pages/load-requests-orders'])
        }else{
          this.router.navigate(['/pages/loads-requests']);
        }
      }
    });
  }

  statusColor(status: string): string {
    switch (status) {
      case 'PUBLICADO':
        return 'primary'; 
      case 'ASIGNADO':
        return 'warning'; 
      case 'RECOGIDO':
        return 'secondary'; 
      case 'RUTA':
        return 'success';  
      case 'COMPLETADO':
        return 'tertiary';  
      default:
        return 'medium';    
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
      ctrl.setValue(num.toFixed(2), { emitEvent: false });
    }
  }

  findStatus()
  {
    if(this.isCarrier)
    {
      this.loadRequestService.findStatus().subscribe((res: string[]) => {
        this.statusOptions = res;
      });
    }
  }

  onStatusChange(ev: any) {
    console.log('ionChange value:', ev.detail.value);
    console.log('formControl status:', this.form.get('status')!.value);
  }
}
