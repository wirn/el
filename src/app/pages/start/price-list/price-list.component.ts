import { Component, Input } from '@angular/core';
import { PriceInterval } from '../../../models/priceInterval.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-price-list',
  imports: [CommonModule],
  templateUrl: './price-list.component.html',
  styleUrl: './price-list.component.scss',
})
export class PriceListComponent {
  @Input() priceIntervalList: PriceInterval[] = [];

  getPriceClass(price: number): string {
    if (price <= 0) {
      return 'price-free';
    } else if (price > 0 && price < 1) {
      return 'price-low';
    } else if (price >= 1 && price < 2) {
      return 'price-mid';
    } else if (price >= 2 && price <= 3) {
      return 'price-high';
    } else if (price > 3) {
      return 'price-optimus-prime';
    } else {
      return '';
    }
  }

  getTimeClass(startTime: Date): string {
    return new Date(startTime).getHours() === new Date().getHours()
      ? 'interval-now'
      : '';
  }
}
