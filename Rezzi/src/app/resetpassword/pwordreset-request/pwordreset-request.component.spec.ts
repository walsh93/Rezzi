import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PwordresetRequestComponent } from './pwordreset-request.component';

describe('PwordresetRequestComponent', () => {
  let component: PwordresetRequestComponent;
  let fixture: ComponentFixture<PwordresetRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PwordresetRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PwordresetRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
