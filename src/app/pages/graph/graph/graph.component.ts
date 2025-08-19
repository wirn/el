import { Component, Input, SimpleChanges } from '@angular/core';
import { PriceInterval } from '../../../models/priceInterval.model';
import { CommonModule } from '@angular/common';
import { Color, NgxChartsModule } from '@swimlane/ngx-charts';

declare enum ScaleType {
  Time = 'time',
  Linear = 'linear',
  Ordinal = 'ordinal',
  Quantile = 'quantile',
}

interface graphData {
  name: string;
  value: number;
}

@Component({
  selector: 'app-interval-graph',
  imports: [CommonModule], //NgxChartsModule
  templateUrl: './graph.component.html',
  styleUrl: './graph.component.scss',
})
export class IntervalGraphComponent {
  @Input() priceIntervalList: PriceInterval[] = [];
  mapedGraphData: graphData[] | null = null;

  view: [number, number] = [400, 800];

  showLabels = true;
  isDoughnut = false;
  // colorScheme: Color = {
  //   name: 'custom',
  //   selectable: true,
  //   group: ScaleType.Linear,
  //   domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'], // Dina färger
  // };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['priceIntervalList'] && this.priceIntervalList) {
      this.mapedGraphData = this.mapPriceIntervalsToGraphData(
        this.priceIntervalList
      );
    }
  }

  mapPriceIntervalsToGraphData(priceIntervals: PriceInterval[]): graphData[] {
    return priceIntervals.map((interval) => ({
      name:
        new Date(interval.time_start).getHours().toString() +
        ' - ' +
        (new Date(interval.time_start).getHours() + 1).toString(),
      value: interval.SEK_per_kWh,
    }));
  }
}
