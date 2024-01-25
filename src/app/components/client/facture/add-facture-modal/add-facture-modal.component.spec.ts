import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFactureModalComponent } from './add-facture-modal.component';

describe('AddFactureModalComponent', () => {
  let component: AddFactureModalComponent;
  let fixture: ComponentFixture<AddFactureModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFactureModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFactureModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
