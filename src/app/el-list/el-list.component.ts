import { Component, OnInit } from '@angular/core';
import { ElectricityPriceService } from '../services/electricity-price.service';
import { CommonModule } from '@angular/common';
import { PriceInterval } from '../models/priceInterval.model';
import { Region } from '../models/regions.enum';

@Component({
    selector: 'app-el-list',
    imports: [CommonModule],
    templateUrl: './el-list.component.html',
    styleUrl: './el-list.component.scss'
})
export class ElListComponent implements OnInit {
  //Capacitor
  public priceIntervalTodayList: PriceInterval[] = [];
  public priceIntervalTomorrowList: PriceInterval[] = [];
  public today: Date | null = null;
  public tomorrow: Date | null = null;

  constructor(private electricityPriceService: ElectricityPriceService) {}

  ngOnInit(): void {
    this.today = new Date();
    const tomorrow = new Date(this.today);
    tomorrow.setDate(this.today.getDate() + 1);
    this.tomorrow = tomorrow;

    this.electricityPriceService
      .getElectricityPrices(this.today, Region.SE3)
      .subscribe((ep: PriceInterval[]) => {
        this.priceIntervalTodayList = ep;
      });

    this.electricityPriceService
      .getElectricityPrices(this.tomorrow, Region.SE3)
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
}
