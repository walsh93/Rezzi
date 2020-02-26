import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HdAdminComponent } from './hd-admin.component';

describe('HdAdminComponent', () => {
  let component: HdAdminComponent;
  let fixture: ComponentFixture<HdAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HdAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HdAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
