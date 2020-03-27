import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPmComponent } from './new-pm.component';

describe('NewPmComponent', () => {
  let component: NewPmComponent;
  let fixture: ComponentFixture<NewPmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
