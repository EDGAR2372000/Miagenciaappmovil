import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { UppercaseDirective } from 'src/app/directives/shared/uppercase.directive';
import { LoaderService } from 'src/app/service/loader.service';
import { LoginService } from 'src/app/service/login.service';
import { NotificationService } from 'src/app/service/notification.service';
import { UiSharedModule } from 'src/app/ui-shared/ui-shared.module';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [UiSharedModule, UppercaseDirective, CommonModule],
})
export class LoginComponent  implements OnInit {
  isLoading: Observable<boolean>;
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private loginService: LoginService,
    private notification: NotificationService,
    private loaderService: LoaderService
  ) { }

  ngOnInit() {
    this.isLoading = this.loaderService.isLoading.asObservable();
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email, Validators.maxLength(60)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }

  onLogin() {
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const credentials = this.loginForm.value;
    this.loaderService.isLoading.next(true);
    this.loginService.login(credentials.username, credentials.password).subscribe({
      next: (data) =>{
        sessionStorage.setItem('user', JSON.stringify(data.username));
        sessionStorage.setItem('token', JSON.stringify(data.access_token));
        sessionStorage.setItem('role', JSON.stringify(data.role))
        this.navCtrl.navigateRoot('/pages/dashboard');
        this.notification.showSuccess('¡Bienvenido!');
      },
      complete: () => {
        this.loaderService.isLoading.next(false); // desactivar loader
      }
      
    });
  }

  goToRegister() {
    this.navCtrl.navigateForward('/auth/register');
  }

}
