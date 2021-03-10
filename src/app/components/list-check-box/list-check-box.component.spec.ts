import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCheckBoxComponent } from './list-check-box.component';

describe('ListCheckBoxComponent', () => {
  let component: ListCheckBoxComponent;
  let fixture: ComponentFixture<ListCheckBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCheckBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCheckBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
