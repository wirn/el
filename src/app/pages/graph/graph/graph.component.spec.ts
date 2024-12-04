import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntervalGraphComponent } from './graph.component';

describe('GraphComponent', () => {
  let component: IntervalGraphComponent;
  let fixture: ComponentFixture<IntervalGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntervalGraphComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IntervalGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
