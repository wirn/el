import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElListComponent } from './el-list.component';

describe('ElListComponent', () => {
  let component: ElListComponent;
  let fixture: ComponentFixture<ElListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
