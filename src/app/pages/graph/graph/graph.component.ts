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
  view: [number, number] = [364, 680];

  showLabels = true;
  isDoughnut = false;

  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Linear,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };

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
      this.markCurrentHourRow(); // uppdatera markering efter ny data
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
}
