import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditLocation } from './edit-location';

describe('EditLocation', () => {
  let component: EditLocation;
  let fixture: ComponentFixture<EditLocation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditLocation],
    }).compileComponents();

    fixture = TestBed.createComponent(EditLocation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
