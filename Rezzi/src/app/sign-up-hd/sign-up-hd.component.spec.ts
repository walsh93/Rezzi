import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpHdComponent } from './sign-up-hd.component';

describe('SignUpHdComponent', () => {
  let component: SignUpHdComponent;
  let fixture: ComponentFixture<SignUpHdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignUpHdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpHdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
