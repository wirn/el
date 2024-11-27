import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PriceInterval } from '../models/priceInterval.model';
import { Region } from '../models/regions.enum';

@Injectable({
  providedIn: 'root',
})
export class ElectricityPriceService {
  private apiUrlBase = 'https://www.elprisetjustnu.se/api/v1/prices';

  constructor(private http: HttpClient) {}

  getElectricityPrices(
    date: Date,
    region: Region
  ): Observable<PriceInterval[]> {
    const formatedDate = `${date.getFullYear()}/${
      date.getMonth() + 1
    }-${date.getDate()}`;
    const url = `${this.apiUrlBase}/${formatedDate}_${region}.json`;
    return this.http.get<PriceInterval[]>(url);
  }
}
