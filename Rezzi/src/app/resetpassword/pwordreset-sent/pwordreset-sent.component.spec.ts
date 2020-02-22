import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PwordresetSentComponent } from './pwordreset-sent.component';

describe('PwordresetSentComponent', () => {
  let component: PwordresetSentComponent;
  let fixture: ComponentFixture<PwordresetSentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PwordresetSentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PwordresetSentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
