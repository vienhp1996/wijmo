import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDataPipe',
})
export class formatDataPipe implements PipeTransform {

  transform(value: string, type: number): string {
    switch (type) {
      case 1:
        let number = parseFloat(value)
        return number?.toLocaleString('en-US', { minimumFractionDigits: 2 })

      case 2:
        let year: string = value.substring(0, 4);
        let month: string = value.substring(5, 7);
        let day: string = value.substring(8, 10);
        return `${day}/${month}/${year}`;

      default:
        return value;
    }
  }
}
