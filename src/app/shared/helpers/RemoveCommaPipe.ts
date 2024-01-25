import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeComma'
})
export class RemoveCommaPipe implements PipeTransform {

  transform(value: string): string {
    if (value !== undefined && value !== null) {
      const val = value.replace(/,/g, ' ');
      return val.replace('.', ',');
    } else {
      return '';
    }
  }
}
