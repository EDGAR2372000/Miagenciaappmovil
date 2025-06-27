import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Carrier } from 'src/app/model/carrier.model';
import { CarrierService } from 'src/app/service/carrier.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: false
})
export class ProfileComponent  implements OnInit {

  form: FormGroup;
  carrier!: Carrier;

  constructor(
    private fb: FormBuilder,
    private carrierService: CarrierService,
    private notificationService: NotificationService,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.buildForm();
    this.loadCarrier();
  }

  private buildForm() {
    this.form = this.fb.group({
      id: [],
      nameCompany: ['', Validators.required],
      rucCompany: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{11}$/)],
      ],
      phone: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{9}$/)],
      ],
      bankName: [''],
      user: ['', Validators.required],
      accountNumber: [
        '',
        [Validators.pattern(/^[0-9]*$/), Validators.minLength(20), Validators.maxLength(20)],
      ],
      interbankCode: [
        '',
        [Validators.pattern(/^[0-9]{1,11}$/), Validators.minLength(11), Validators.maxLength(11)],
      ],
      status: [''],
    });
  }

  loadCarrier() {
    const username = JSON.parse(sessionStorage.getItem('user'));
    this.carrierService.getByUsername(username).subscribe({
      next: (c: Carrier) => {
        this.carrier = c;
        this.form.patchValue({
          id: c.id,
          nameCompany: c.nameCompany,
          rucCompany: c.rucCompany,
          phone: c.phone,
          user: c.user,
          bankName: c.bankName || '',
          accountNumber: c.accountNumber || '',
          interbankCode: c.interbankCode || '',
          status: c.status,
        });
      }
    });
  }

  /** Conveniencia para acceder a controles */
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit() {

    if(this.form.invalid) {
      this.notificationService.showError('Por favor, complete todos los campos requeridos correctamente.');
      return;
    }

    const id = this.form.get('id')?.value;
    this.carrierService.update(id, this.form.value).subscribe({
      next: () => {
        this.notificationService.showSuccess('Perfil actualizado correctamente.');
        this.navController.back();
      }
    });
  }


}
