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

@Component({
  selector: 'app-sign-in',
  standalone: false,
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {

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
    private navCtrl: NavController
  ) { }
  
  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.registroForm = this.fb.group({
      typeUser: ['', Validators.required],
      dni: ['', [Validators.required, Validators.maxLength(8), Validators.minLength(8)]],
      fullName: ['', [Validators.required, Validators.maxLength(80)]],
      phone: ['', [Validators.required, Validators.maxLength(9), Validators.minLength(9)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(60)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(60)]],
      licensePlate: [''],
      driverLicense: ['']
    });

    this.registroForm.get('typeUser').valueChanges.subscribe(value => {
      if (value === 'transportista') {
        this.registroForm.get('licensePlate').setValidators([Validators.required, Validators.maxLength(7), Validators.minLength(7)]);
        this.registroForm.get('driverLicense').setValidators([Validators.required, Validators.maxLength(20)]);
      } else {
        this.registroForm.get('licensePlate').clearValidators();
        this.registroForm.get('driverLicense').clearValidators();
      }
      this.registroForm.get('licensePlate').updateValueAndValidity();
      this.registroForm.get('driverLicense').updateValueAndValidity();
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
      carrier.dni = data.dni;
      carrier.fullName = data.fullName;
      carrier.phone = data.phone;
      carrier.licensePlate = data.licensePlate;
      carrier.driverLicense = data.driverLicense;

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
    console.log(event.target.value);
    this.showFields = true;
  }

  goToLogin() {
    this.navCtrl.navigateForward('/auth/login');
  }
}
