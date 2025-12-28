import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemTotals } from './item-totals';

describe('ItemTotals', () => {
  let component: ItemTotals;
  let fixture: ComponentFixture<ItemTotals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemTotals]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemTotals);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
