import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterHome } from './register-home';

describe('RegisterHome', () => {
  let component: RegisterHome;
  let fixture: ComponentFixture<RegisterHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
