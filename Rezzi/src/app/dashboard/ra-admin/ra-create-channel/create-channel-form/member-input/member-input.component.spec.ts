import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberInputComponent } from './member-input.component';

describe('MemberInputComponent', () => {
  let component: MemberInputComponent;
  let fixture: ComponentFixture<MemberInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
