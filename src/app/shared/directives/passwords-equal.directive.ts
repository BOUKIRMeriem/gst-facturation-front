import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[appPasswordsEqual]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: PasswordsEqualDirective,
    multi: true
  }]
})
export class PasswordsEqualDirective implements Validator{

  constructor() { }
  validate(control: AbstractControl): ValidationErrors | null {
    return PasswordsEqualValidator(control);
  }
}
export const PasswordsEqualValidator:  ValidatorFn = (control: AbstractControl): ValidationErrors | null =>{
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  return password && confirmPassword && password.value==confirmPassword.value?null:{notEqual: true};
};
