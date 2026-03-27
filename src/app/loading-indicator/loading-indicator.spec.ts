import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingComponent } from './loading-indicator';
import { LoadingService } from '../services/loading';
import { signal, WritableSignal } from '@angular/core';
import { LoadingInterface } from '../model/loading';
import { By } from '@angular/platform-browser';

const hideLoadingMessage: LoadingInterface = {
  isLoading: false,
  message: 'It is not loading.',
};

const showLoadingMessage: LoadingInterface = {
  isLoading: true,
  message: 'It is loading.',
};

describe('LoadingComponent', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;
  let loadingServiceMock: jest.Mocked<LoadingService>;
  let loadingSignal: WritableSignal<LoadingInterface>;

  beforeEach(async () => {
    loadingSignal = signal({ isLoading: false, message: '' });

    loadingServiceMock = { loading: loadingSignal } as unknown as jest.Mocked<LoadingService>;

    await TestBed.configureTestingModule({
      imports: [LoadingComponent],
      providers: [{ provide: LoadingService, useValue: loadingServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get updates to the loading signal', () => {
    loadingSignal.set(showLoadingMessage);

    fixture.detectChanges();

    expect(component['loading']()).toEqual(showLoadingMessage);
  });

  it('should display the loading message component', () => {
    loadingSignal.set(hideLoadingMessage);

    fixture.detectChanges();

    const hideLoadingMessageComponent = fixture.nativeElement.querySelector('mat-spinner');

    // The loading message component should not be displayed.
    expect(hideLoadingMessageComponent).toBeFalsy();

    loadingSignal.set(showLoadingMessage);

    fixture.detectChanges();

    const showLoadingMessageComponent = fixture.nativeElement.querySelector('mat-spinner');

    // The loading message component should be displayed.
    expect(showLoadingMessageComponent).toBeTruthy();
    expect(component['loading']()).toEqual(showLoadingMessage);
  });

  it('should hide the loading message component', () => {
    loadingSignal.set(showLoadingMessage);

    fixture.detectChanges();

    const showLoadingMessageComponent = fixture.nativeElement.querySelector('mat-spinner');

    // The loading message component should be displayed.
    expect(showLoadingMessageComponent).toBeTruthy();
    expect(component['loading']()).toEqual(showLoadingMessage);

    loadingSignal.set(hideLoadingMessage);

    fixture.detectChanges();

    const hideLoadingMessageComponent = fixture.nativeElement.querySelector('mat-spinner');

    // The loading message component should not be displayed.
    expect(hideLoadingMessageComponent).toBeFalsy();
  });

  it('should display the right loading message text', () => {
    loadingSignal.set(showLoadingMessage);

    fixture.detectChanges();

    let loadingMessage: HTMLElement = fixture.debugElement.query(
      By.css('[data-testid="loading-message"]'),
    ).nativeElement;

    expect(loadingMessage).toBeTruthy();
    expect(loadingMessage.textContent).toEqual(showLoadingMessage.message);
  });
});
