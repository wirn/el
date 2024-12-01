import { Component } from '@angular/core';
import { PriceInterval } from '../../models/priceInterval.model';
import { ElectricityPriceService } from '../../services/electricity-price.service';
import { Region } from '../../models/regions.enum';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-start',
  imports: [CommonModule, RouterModule],
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss',
})
export class StartComponent {
  //Capacitor
  public priceIntervalTodayList: PriceInterval[] = [];
  public priceIntervalTomorrowList: PriceInterval[] = [];
  public today: Date | null = null;
  public tomorrow: Date | null = null;

  constructor(
    private electricityPriceService: ElectricityPriceService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.today = new Date();
    const tomorrow = new Date(this.today);
    tomorrow.setDate(this.today.getDate() + 1);
    this.tomorrow = tomorrow;

    const region: Region = this.cookieService.get('region')
      ? (this.cookieService.get('region') as Region)
      : Region.SE3;

    this.electricityPriceService
      .getElectricityPrices(this.today, region)
      .subscribe((ep: PriceInterval[]) => {
        this.priceIntervalTodayList = ep;
      });

    this.electricityPriceService
      .getElectricityPrices(this.tomorrow, region)
      .subscribe((ep: PriceInterval[]) => {
        this.priceIntervalTomorrowList = ep;
      });
  }

  getPriceClass(price: number): string {
    if (price >= 0 && price < 1) {
      return 'price-low';
    } else if (price >= 1 && price < 2) {
      return 'price-high';
    } else if (price >= 2 && price <= 3) {
      return 'Three is a crowd.';
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
