import { Client } from 'src/app/model/client.model';
import { ClientService } from './../../service/client.service';
import { USER_CARRIER, USER_CLIENT} from './../../shared/constants.util';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/model/user.model';
import { NotificationService } from 'src/app/service/notification.service';
import { Router } from '@angular/router';
import { Carrier } from 'src/app/model/carrier.model';
import { CarrierService } from 'src/app/service/carrier.service';
import { NavController } from '@ionic/angular';
import { SunatService } from 'src/app/service/sunat.service';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { ReniecService } from 'src/app/service/reniec.service';
import { Observable } from 'rxjs';
import { LoaderService } from 'src/app/service/loader.service';

@Component({
  selector: 'app-sign-in',
  standalone: false,
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  isLoading: Observable<boolean>;
  registroForm: FormGroup;
  showFields: boolean = false;

  type: string; 
  client: string = USER_CLIENT;
  carrier: string = USER_CARRIER;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private carrierService: CarrierService,
    private notification: NotificationService,
    private navCtrl: NavController,
    private sunatService: SunatService,
    private reniecService: ReniecService,
    private loaderService: LoaderService,
  ) { }
  
  ngOnInit(): void {
    this.isLoading = this.loaderService.isLoading.asObservable();
    this.createForm();
    this.watchRucField();
    this.watchDniField();
  }

  createForm() {
    this.registroForm = this.fb.group({
      typeUser: ['', Validators.required],
      dni: [''],
      fullName: [''],
      phone: ['', [Validators.required, Validators.maxLength(9), Validators.minLength(9)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(60)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(60)]],
      nameCompany: [{ value: '', disabled: true }],
      rucCompany: ['']
    });

    this.registroForm.get('typeUser').valueChanges.subscribe(value => {
      if (value === 'TRANSPORTISTA') {
        this.registroForm.get('nameCompany').setValidators([Validators.required, Validators.maxLength(60), Validators.minLength(7)]);
        this.registroForm.get('rucCompany').setValidators([Validators.required, Validators.maxLength(11), Validators.minLength(11)]);
      } else {
        this.registroForm.get('nameCompany').clearValidators();
        this.registroForm.get('rucCompany').clearValidators();
      }
      this.registroForm.get('nameCompany').updateValueAndValidity();
      this.registroForm.get('rucCompany').updateValueAndValidity();

      if(value === 'CLIENTE') {
        this.registroForm.get('dni').setValidators([Validators.required, Validators.maxLength(8), Validators.minLength(8)]);
        this.registroForm.get('fullName').setValidators([Validators.required,Validators.required, Validators.maxLength(80)]);
      }else{
        this.registroForm.get('dni').clearValidators();
        this.registroForm.get('fullName').clearValidators();
      }
      this.registroForm.get('dni').updateValueAndValidity();
      this.registroForm.get('fullName').updateValueAndValidity();
    });
  }
  
  operate()
  {
    if (this.registroForm.valid) {
      if(this.registroForm.get('typeUser').value === this.client) {
        this.operateClient();
      }else if(this.registroForm.get('typeUser').value === this.carrier) {
        this.operateTransportista();
      }
    }
  }

  operateClient()
  {
    if (this.registroForm.valid) {
      const data = this.registroForm.value;

      const client = new Client();
      client.dni = data.dni;
      client.fullName = data.fullName;
      client.phone = data.phone;

      const user = new User();
      user.email = data.email;
      user.password = data.password;
      user.role = data.typeUser;

      client.user = user;

      this.clientService.save(client).subscribe(data => {
        this.notification.showSuccess('Cliente registrado');
        this.navCtrl.navigateForward(['/auth/login']);
      });
    }
  }

  operateTransportista() {
    if (this.registroForm.valid) {
      const data = this.registroForm.value;

      const carrier = new Carrier();
      //carrier.dni = data.dni;
      //carrier.fullName = data.fullName;
      carrier.phone = data.phone;
      carrier.nameCompany = this.registroForm.getRawValue().nameCompany;
      carrier.rucCompany = data.rucCompany;

      const user = new User();
      user.email = data.email;
      user.password = data.password;
      user.role = data.typeUser;

      carrier.user = user;

      this.carrierService.save(carrier).subscribe(data => {
        this.notification.showSuccess('Transportista registrado');
        this.navCtrl.navigateForward('/auth/login');
      });

    }
  }

  onRoleChange(event: any) {
    this.showFields = true;
  }

  goToLogin() {
    this.navCtrl.navigateForward('/auth/login');
  }

  consultRuc(ruc: string) {
    this.loaderService.isLoading.next(true);
    this.sunatService.consultRuc(ruc).subscribe({
      next: (data) => {
        if (data && data.razonSocial) {
          this.registroForm.patchValue({ nameCompany: data.razonSocial });
          this.registroForm.get('nameCompany').updateValueAndValidity();
          this.notification.showSuccess('RUC encontrado: ' + data.razonSocial);
        } else {
          this.notification.showError('RUC no encontrado');
          this.registroForm.patchValue({ nameCompany: '' });
        }
      },
      complete: () => {
        this.loaderService.isLoading.next(false); // desactivar loader
      }
    });
  }
  

  consultDni(dni: string) {
    this.loaderService.isLoading.next(true);
    this.reniecService.consultDni(dni).subscribe({
      next: (data) => {
        if (data && data.nombreCompleto) {
          this.registroForm.patchValue({ fullName: data.nombreCompleto });
          this.registroForm.get('fullName').updateValueAndValidity();
          this.notification.showSuccess('DNI encontrado: ' + data.nombres);
        } else {
          this.notification.showError('DNI no encontrado');
          this.registroForm.patchValue({ fullName: '' });
        }
      },
      complete: () => {
        this.loaderService.isLoading.next(false);
      }
    });
  }

  private watchRucField() {
    this.registroForm.get('rucCompany')?.valueChanges.pipe(
      debounceTime(600), // espera 600ms sin escribir
      distinctUntilChanged(),
      filter((ruc: string) => ruc && ruc.length === 11)
    ).subscribe((ruc: string) => {
      this.consultRuc(ruc);
    });
  }

  private watchDniField() {
    this.registroForm.get('dni')?.valueChanges.pipe(
      debounceTime(600), // espera 600ms sin escribir
      distinctUntilChanged(),
      filter((dni: string) => dni && dni.length === 8)
    ).subscribe((dni: string) => {
      this.consultDni(dni);
    });
  }
}
