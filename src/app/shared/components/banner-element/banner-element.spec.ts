import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerElement } from './banner-element';

describe('BannerElement', () => {
  let component: BannerElement;
  let fixture: ComponentFixture<BannerElement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerElement],
    }).compileComponents();

    fixture = TestBed.createComponent(BannerElement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
