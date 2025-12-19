import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  SimpleChanges,
  OnDestroy,
  OnInit,
  ElementRef,
  viewChild,
} from '@angular/core';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { PriceInterval } from '../../../models/priceInterval.model';

type CustomColor = {
  name: string;
  value: string;
};

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
export class IntervalGraphComponent implements OnInit, OnDestroy {
  @Input() priceIntervalList: PriceInterval[] = [];

  mappedGraphData: GraphData[] = [];
  view: [number, number] = [364, 666];
  customColors: CustomColor[] = [];
  showLabels = true;
  isDoughnut = false;

  // Hook till wrapper-diven (Angulars nya viewChild-syntax)
  chartHost = viewChild.required<ElementRef<HTMLElement>>('chartHost');

  currentHourLabel = this.getCurrentHourLabel();
  private hourTimerId: number | null = null;

  ngOnInit(): void {
    this.hourTimerId = window.setInterval(() => {
      this.currentHourLabel = this.getCurrentHourLabel();
      this.markCurrentHourRow(); // uppdatera markeringen när timmen ändras
    }, 60_000);
  }

  ngOnDestroy(): void {
    if (this.hourTimerId) window.clearInterval(this.hourTimerId);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['priceIntervalList']) {
      this.mappedGraphData = this.mapPriceIntervalsToGraphData(
        this.priceIntervalList ?? []
      );
      this.customColors = this.buildCustomColors(this.mappedGraphData);
      this.markCurrentHourRow();
    }
  }

  private markCurrentHourRow(): void {
    // Vänta ett tick så att ngx-charts hinner rendera SVG:n
    queueMicrotask(() => {
      const host = this.chartHost().nativeElement;

      // Tick-text i y-axeln (SVG). Selektorn kan variera lite mellan versioner,
      // men detta brukar fungera för bar-horizontal.
      const tickTexts = host.querySelectorAll<SVGTextElement>(
        'g.y.axis g.tick text, g.y-axis g.tick text'
      );

      tickTexts.forEach((t) => {
        t.classList.remove('is-current-hour-tick');
        t.parentElement?.classList.remove('is-current-hour-tick');
      });

      for (const t of Array.from(tickTexts)) {
        const label = (t.textContent ?? '').trim();
        if (label === this.currentHourLabel) {
          t.classList.add('is-current-hour-tick');
          t.parentElement?.classList.add('is-current-hour-tick'); // tick-gruppen
          break;
        }
      }
    });
  }

  private getCurrentHourLabel(): string {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    return `${hh}:00`;
  }

  private mapPriceIntervalsToGraphData(
    priceIntervals: PriceInterval[]
  ): GraphData[] {
    const points = [...priceIntervals]
      .map((p) => ({ epoch: this.toEpoch(p.time_start), value: p.SEK_per_kWh }))
      .filter((p) => Number.isFinite(p.epoch) && Number.isFinite(p.value))
      .sort((a, b) => a.epoch - b.epoch);

    const byHour = new Map<number, { sum: number; count: number }>();

    for (const p of points) {
      const d = new Date(p.epoch);
      d.setMinutes(0, 0, 0);
      const hourKey = d.getTime();

      const agg = byHour.get(hourKey) ?? { sum: 0, count: 0 };
      agg.sum += p.value;
      agg.count += 1;
      byHour.set(hourKey, agg);
    }

    return Array.from(byHour.entries())
      .sort(([a], [b]) => a - b)
      .map(([hourEpoch, agg]) => {
        const hh = String(new Date(hourEpoch).getHours()).padStart(2, '0');
        return { name: `${hh}:00`, value: agg.sum / agg.count };
      });
  }

  private toEpoch(value: unknown): number {
    const t =
      value instanceof Date
        ? value.getTime()
        : new Date(value as any).getTime();
    return Number.isFinite(t) ? t : 0;
  }

  private buildCustomColors(data: GraphData[]): CustomColor[] {
    return data.map((d) => ({
      name: d.name,
      value: this.getPriceColor(d.value),
    }));
  }

  private getPriceColor(price: number): string {
    if (price <= 0) return 'blue';
    if (price > 0 && price < 1) return 'green';
    if (price >= 1 && price < 2) return 'orange';
    if (price >= 2 && price <= 3) return 'red';
    if (price > 3) return 'dark-red';
    return 'gray';
  }
}
