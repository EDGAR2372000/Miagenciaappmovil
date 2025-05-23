import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appUppercase]',
  standalone: true
})
export class UppercaseDirective {
  constructor(private control: NgControl, private el: ElementRef) {}

  @HostListener('ionInput', ['$event'])
  onIonInput(event: any) {
    const value: string = event.detail?.value || '';
    const upper = value.toUpperCase();

    // Actualiza el formControl
    this.control.control?.setValue(upper, { emitEvent: false });

    // Actualiza el input nativo dentro de ion-input
    const nativeInput: HTMLInputElement | null = this.el.nativeElement.querySelector('input');
    if (nativeInput) {
      nativeInput.value = upper;
    }
  }
}
