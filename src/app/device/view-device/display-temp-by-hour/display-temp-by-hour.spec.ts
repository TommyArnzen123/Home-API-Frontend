import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayTempByHour } from './display-temp-by-hour';

describe('DisplayTempByHour', () => {
  let component: DisplayTempByHour;
  let fixture: ComponentFixture<DisplayTempByHour>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayTempByHour]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayTempByHour);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
