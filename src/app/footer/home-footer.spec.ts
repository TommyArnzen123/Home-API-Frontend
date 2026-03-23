import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeFooter } from './home-footer';
import { By } from '@angular/platform-browser';

describe('HomeFooter', () => {
  let component: HomeFooter;
  let fixture: ComponentFixture<HomeFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeFooter],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeFooter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the copyright text with the right text content', () => {
    const verifyText = '© ' + component['currentYear'] + ' | All rights reserved.';
    let copyrightText: HTMLElement = fixture.debugElement.query(
      By.css('[data-testid="copyright"]'),
    ).nativeElement;
    expect(copyrightText.textContent.trim()).toEqual(verifyText);
  });
});
