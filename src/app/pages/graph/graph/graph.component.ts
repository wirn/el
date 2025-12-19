import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { PriceInterval } from '../../../models/priceInterval.model';

interface GraphData {
  name: string;
  value: number;
}

@Component({
  selector: 'app-interval-graph',
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './graph.component.html',
  styleUrl: './graph.component.scss',
})
export class IntervalGraphComponent {
  @Input() priceIntervalList: PriceInterval[] = [];

  mappedGraphData: GraphData[] = [];

  view: [number, number] = [364, 615];

  showLabels = true;
  isDoughnut = false;

  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Linear,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['priceIntervalList']) {
      this.mappedGraphData = this.mapPriceIntervalsToGraphData(
        this.priceIntervalList ?? []
      );
    }
  }

  private mapPriceIntervalsToGraphData(
    priceIntervals: PriceInterval[]
  ): GraphData[] {
    return [...priceIntervals]
      .sort((a, b) => this.toEpoch(a.time_start) - this.toEpoch(b.time_start))
      .map((interval) => {
        const date = new Date(interval.time_start);
        return {
          name: this.formatHHmm(date),
          value: interval.SEK_per_kWh,
        };
      });
  }

  private formatHHmm(date: Date): string {
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  }

  private toEpoch(value: unknown): number {
    const t =
      value instanceof Date
        ? value.getTime()
        : new Date(value as any).getTime();
    return Number.isFinite(t) ? t : 0;
  }
}
