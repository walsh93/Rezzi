import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PwordresetChangeComponent } from './pwordreset-change.component';

describe('PwordresetChangeComponent', () => {
  let component: PwordresetChangeComponent;
  let fixture: ComponentFixture<PwordresetChangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PwordresetChangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PwordresetChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
