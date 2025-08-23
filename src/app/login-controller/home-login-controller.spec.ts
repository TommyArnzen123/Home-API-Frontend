import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeLoginController } from './home-login-controller';

describe('HomeLoginController', () => {
  let component: HomeLoginController;
  let fixture: ComponentFixture<HomeLoginController>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeLoginController],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeLoginController);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
