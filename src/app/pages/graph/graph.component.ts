import { Component } from '@angular/core';
import { PriceInterval } from '../../models/priceInterval.model';
import { priceMeta } from '../../models/price-meta.model';
import { Region } from '../../models/regions.enum';
import { ElectricityPriceService } from '../../services/electricity-price.service';
import { CookieService } from 'ngx-cookie-service';
import { Router, RouterModule } from '@angular/router';
import { IntervalGraphComponent } from './graph/graph.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-graph',
  imports: [RouterModule, IntervalGraphComponent, CommonModule],
  templateUrl: './graph.component.html',
  styleUrl: './graph.component.scss',
})
export class GraphComponent {
  public priceIntervalTodayList: PriceInterval[] = [];
  public priceIntervalTomorrowList: PriceInterval[] = [];
  public priceMetaToday: priceMeta | null = null;
  public priceMetaTomorrow: priceMeta | null = null;
  public today: Date = new Date();
  public tomorrow: Date = new Date();
  public region: Region | null = null;

  constructor(
    private electricityPriceService: ElectricityPriceService,
    private cookieService: CookieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.region = this.getRegion();

    this.setDates();

    if (this.region) {
      this.electricityPriceService
        .getElectricityPrices(this.today, this.region)
        .subscribe((ep: PriceInterval[]) => {
          this.priceIntervalTodayList = ep;
          this.priceMetaToday = this.calculatePriceMeta(ep);
        });

      this.electricityPriceService
        .getElectricityPrices(this.tomorrow, this.region)
        .subscribe((ep: PriceInterval[]) => {
          this.priceIntervalTomorrowList = ep;
          this.priceMetaTomorrow = this.calculatePriceMeta(ep);
        });
    } else {
      this.router.navigate(['/settings']);
    }
  }

  private setDates() {
    this.today = new Date();
    const tomorrow = new Date(this.today);
    tomorrow.setDate(this.today.getDate() + 1);
    this.tomorrow = tomorrow;
  }

  private getRegion(): Region | null {
    return this.cookieService.get('region')
      ? (this.cookieService.get('region') as Region)
      : null;
  }

  private calculatePriceMeta(priceIntervals: PriceInterval[]): priceMeta {
    if (!priceIntervals || priceIntervals.length === 0) {
      return { min: 0, max: 0, average: 0 };
    }

    const prices = priceIntervals.map((interval) => interval.SEK_per_kWh);

    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const average =
      prices.reduce((sum, price) => sum + price, 0) / prices.length;

    return { min, max, average };
  }

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
}
