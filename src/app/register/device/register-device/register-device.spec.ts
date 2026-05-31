import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterDevice } from './register-device';

describe('RegisterDevice', () => {
  let component: RegisterDevice;
  let fixture: ComponentFixture<RegisterDevice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterDevice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterDevice);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
