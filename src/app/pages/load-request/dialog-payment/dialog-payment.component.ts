import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, Platform, ToastController } from '@ionic/angular';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-dialog-payment',
  templateUrl: './dialog-payment.component.html',
  styleUrls: ['./dialog-payment.component.scss'],
  standalone: false
})
export class DialogPaymentComponent  implements OnInit {

  form: FormGroup;
  @ViewChild('cardCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private logos: { [key: string]: HTMLImageElement } = {};

  constructor(private fb: FormBuilder,
    private modalCtrl: ModalController,
  ) {
    this.form = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{16}$/)]],
      cardHolder: ['', Validators.required],
      expiration: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      ccv: ['', [Validators.required, Validators.pattern(/^[0-9]{3,4}$/)]]
    });
  }

  ngOnInit(): void {
    this.form.valueChanges.subscribe(() => this.drawCard());
  }

  async ngAfterViewInit(): Promise<void> {
    // 1) Inicializa el contexto
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;

    // 2) Precarga ambas imágenes en paralelo
    await Promise.all([
      this.loadLogo('visa', '/assets/images/request/visa.webp'),
      this.loadLogo('mastercard', '/assets/images/request/mastercard.webp'),
      this.loadLogo('amex', '/assets/images/request/american-express.webp')
    ]);

    // 3) Dibujo inicial
    this.drawCard();
  }

  private loadLogo(key: string, url: string) {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      this.logos[key] = img;
      this.drawCard(); // repinta cuando esté cargada
    };
  }

    // Reemplaza tu drawCard anterior con esto:
  private drawCard(): void {
    if (!this.ctx) return;
    const canvas = this.canvasRef.nativeElement;
    // Clear canvas
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw background
    this.ctx.fillStyle = '#444';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw logo based on card number prefix
    const numRaw = this.form.get('cardNumber')!.value || '';
    const firstDigit = numRaw.charAt(0);
    let logoImg: HTMLImageElement | undefined;
    if (firstDigit === '4') {
      logoImg = this.logos['visa'];
    } else if (firstDigit === '5') {
      logoImg = this.logos['mastercard'];
    }else if (numRaw.startsWith('34') || numRaw.startsWith('37')) {
      logoImg = this.logos['amex'];
    }
    if (logoImg) {
      const w = 60;
      const h = (logoImg.height / logoImg.width) * w;
      this.ctx.drawImage(logoImg, canvas.width - w - 20, 20, w, h);
    }
    // 1) Número de tarjeta
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '18px monospace';
    const num = numRaw.padEnd(16, '•').replace(/(.{4})/g, '$1 ').trim();
    this.ctx.fillText(num, 20, 80);

    // 2) Titular
    this.ctx.font = '１２px sans-serif';
    this.ctx.fillText('Card Holder', 20, 120);
    this.ctx.font = '14px sans-serif';
    this.ctx.fillText((this.form.get('cardHolder')!.value || 'FULL NAME').toUpperCase(), 20, 140);

    // 3) Expiración
    this.ctx.font = '12px sans-serif';
    this.ctx.fillText('Expires', 220, 120);
    this.ctx.font = '14px sans-serif';
    this.ctx.fillText(this.form.get('expiration')!.value || 'MM/YY', 220, 140);

    // 4) CCV
    this.ctx.font = '12px sans-serif';
    this.ctx.fillText('CCV', 20, 180);
    this.ctx.font = '14px sans-serif';
    this.ctx.fillText(this.form.get('ccv')!.value || '•••', 60, 180);
  }

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Devolver datos al componente padre
    await this.modalCtrl.dismiss({
      paid: true,
    });
  }

}
