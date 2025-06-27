import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ModalController, Platform, ToastController } from '@ionic/angular';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-photoviewer',
  templateUrl: './photoviewer.component.html',
  styleUrls: ['./photoviewer.component.scss'],
  standalone: false
})
export class PhotoviewerComponent  implements OnInit {

  // @Input() photoUrl!: string;
  // safeUrl!: SafeResourceUrl;

  // constructor(
  //   private modalCtrl: ModalController,
  //   private sanitizer: DomSanitizer
  // ) {}

  // ngOnInit() {

  //   this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.photoUrl);
  // }

  // close() {
  //   this.modalCtrl.dismiss();
  // }
  @Input() photoUrl!: string;

  constructor(
    private platform: Platform,
    private modalCtrl: ModalController
  ) {}

  ngOnInit(): void {
      
  }

  async openPdf() {
    if (this.platform.is('hybrid')) {
      // Esto abre la URL en Chrome Custom Tab (Android) o Safari View Controller (iOS)
      await Browser.open({ url: this.photoUrl });
    } else {
      // En navegador normal
      window.open(this.photoUrl, '_blank');
    }
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
