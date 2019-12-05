import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoCardPopupComponent } from './no-card-popup.component';

describe('NoCardPopupComponent', () => {
  let component: NoCardPopupComponent;
  let fixture: ComponentFixture<NoCardPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoCardPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoCardPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
