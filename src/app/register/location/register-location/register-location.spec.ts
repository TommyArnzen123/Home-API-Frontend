import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterLocation } from './register-location';

describe('RegisterLocation', () => {
  let component: RegisterLocation;
  let fixture: ComponentFixture<RegisterLocation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterLocation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterLocation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
