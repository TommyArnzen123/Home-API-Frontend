import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLocation } from './view-location';

describe('ViewLocation', () => {
  let component: ViewLocation;
  let fixture: ComponentFixture<ViewLocation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewLocation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewLocation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
