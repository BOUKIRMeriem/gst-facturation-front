import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[appAllowedRefProduit]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: AllowedRefProduitDirective,
    multi: true
  }]
})
export class AllowedRefProduitDirective implements Validator{
  @Input('appAllowedRefProduit') allowedRefProd ='';
  constructor() {
  }
  validate(control: AbstractControl): ValidationErrors | null {
    return this.allowedRefProd?allowedRefProduitValidator(new RegExp(this.allowedRefProd))(control):null;
  }
}

export function allowedRefProduitValidator(refProdRe: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const allowed = refProdRe.test(control.value);
    return allowed ? null : { allowedRefProduit: { value: control.value } }
  }
}
