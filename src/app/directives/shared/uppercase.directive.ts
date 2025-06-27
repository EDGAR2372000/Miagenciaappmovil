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
    const inputEl: HTMLInputElement | null = this.el.nativeElement.querySelector('input');
    if (!inputEl) return;

    const value: string = event.detail?.value || '';
    const upper = value.toUpperCase();

    // Solo actualiza si el valor ha cambiado (evita bucles y pérdida de cursor)
    if (value !== upper) {
      const cursorPos = inputEl.selectionStart ?? value.length;

      // Actualiza el FormControl sin emitir evento
      this.control.control?.setValue(upper, { emitEvent: false });

      // Actualiza el input y conserva posición del cursor
      inputEl.value = upper;

      // Restaurar la posición del cursor
      setTimeout(() => {
        inputEl.setSelectionRange(cursorPos, cursorPos);
      });
    }
  }
}
