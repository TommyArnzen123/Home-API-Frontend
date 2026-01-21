import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptiveError } from './captive-error';

describe('CaptiveError', () => {
  let component: CaptiveError;
  let fixture: ComponentFixture<CaptiveError>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaptiveError],
    }).compileComponents();

    fixture = TestBed.createComponent(CaptiveError);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
