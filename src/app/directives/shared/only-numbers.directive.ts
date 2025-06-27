// only-numbers.directive.ts
import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appOnlyNumbers]',
  standalone: true
})
export class OnlyNumbersDirective {
  constructor(private control: NgControl, private el: ElementRef) {}

  @HostListener('ionInput', ['$event'])
  onIonInput(event: any) {
    let value: string = event.detail?.value ?? '';

    // 1) Quitar todo menos dígitos y puntos:
    let filtered = value.replace(/[^0-9.]/g, '');

    // 2) Si hay más de un punto, dejar sólo el primero:
    const parts = filtered.split('.');
    if (parts.length > 1) {
      const integer = parts.shift();           // parte antes del primer punto
      const decimal = parts.join('');          // concatena todo lo que venga tras él
      filtered = `${integer}.${decimal}`;
    }

    // 3) Actualizar el formControl (sin volver a emitir cambios):
    this.control.control?.setValue(filtered, { emitEvent: false });

    // 4) Actualizar también el input nativo para que no “parpadee”:
    const native = this.el.nativeElement.querySelector('input');
    if (native) {
      native.value = filtered;
    }
  }
}
