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
}