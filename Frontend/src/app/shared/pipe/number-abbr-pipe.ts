import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberAbbr'
})
export class NumberAbbrPipe implements PipeTransform {

  transform(value: number | null | undefined, digits: number = 0): string {
    if (value === null || value === undefined) return '0';

    const units = [
      { value: 1_000_000_000, symbol: 'B' },
      { value: 1_000_000, symbol: 'M' },
      { value: 1_000, symbol: 'K' }
    ];

    for (const unit of units) {
      if (value >= unit.value) {
        return (value / unit.value)
          .toFixed(digits)
          .replace(/\.0+$|(\.\d*[1-9])0+$/, '$1') + unit.symbol;
      }
    }

    return value.toString();
  }
}
