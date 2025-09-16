import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalElement } from './modal-element';

describe('ModalElement', () => {
  let component: ModalElement;
  let fixture: ComponentFixture<ModalElement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalElement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalElement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
