import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { priceMeta } from '../../../models/price-meta.model';

@Component({
  selector: 'app-min-max',
  imports: [CommonModule],
  templateUrl: './min-max.component.html',
  styleUrl: './min-max.component.scss',
})
export class MinMaxComponent {
  @Input() dateStr: Date | null = null;
  @Input() priceMeta: priceMeta = {
    min: 0,
    max: 0,
    average: 0,
  };

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

  getDateName(): string {
    const dateStr = this.dateStr?.toLocaleDateString('sv-SE', {
      weekday: 'long',
    });

    if (!dateStr) {
      return '';
    }

    return dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
  }
}
