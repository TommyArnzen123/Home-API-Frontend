import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDevice } from './view-device';

describe('ViewDevice', () => {
  let component: ViewDevice;
  let fixture: ComponentFixture<ViewDevice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDevice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDevice);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
