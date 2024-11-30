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
    const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    const url = `${this.apiUrlBase}/${formattedDate}_${region}.json`;
    return this.http.get<PriceInterval[]>(url);
  }
}
