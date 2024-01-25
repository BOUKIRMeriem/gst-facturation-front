import { Directive } from '@angular/core';
import { ValidatorFn } from '@angular/forms';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appLessThan]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: LessThanDirective,
    multi: true
  }]
})
export class LessThanDirective implements Validator{

  constructor() { }
  validate(control: AbstractControl): ValidationErrors | null {
    return lessThanValidator(control);
  }
}

export const lessThanValidator : ValidatorFn = (control: AbstractControl): ValidationErrors | null =>{
  const minCommande = control.get('minCommande') || control.get('qteInf');
  const maxCommande = control.get('maxCommande') || control.get('qteSup');
  return minCommande && maxCommande && minCommande.value<maxCommande.value?null:{invalidValue: true};
};

