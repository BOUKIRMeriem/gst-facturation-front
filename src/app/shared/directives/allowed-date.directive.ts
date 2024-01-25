import { Directive } from '@angular/core';
import { Validator, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[appAllowedDate]'
})
export class AllowedDateDirective implements Validator{

  constructor() { }
  validate(control: AbstractControl): ValidationErrors | null {
    return AllowedDate(control);
  }
}

export const AllowedDate : ValidatorFn = (control: AbstractControl): ValidationErrors | null =>{
  const regex = new RegExp('[0-9]{1,2}-[0-9]{1,2}-[0-9]{4}');
  let date = control.value;
  return regex.test(date)?null:{invalidValue: true};
};
