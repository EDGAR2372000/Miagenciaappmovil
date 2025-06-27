import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';


@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private toastCtrl: ToastController) {}

  async showSuccess(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'bottom',
      icon: 'checkmark-circle-outline',
      cssClass: 'toast-light'
    });
    await toast.present();
  }
  
  async showError(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 5000,
      position: 'bottom',
      icon: 'close-circle-outline',
      color: 'danger',
      cssClass: 'toast-error'
    });
    await toast.present();
  }

  async showWarning(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 4000,
      position: 'bottom',
      icon: 'alert-circle-outline',
      color: 'warning',
      cssClass: 'toast-warning'
    });
    await toast.present();
  }
}