import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HaAdminComponent } from './ha-admin.component';

describe('HaAdminComponent', () => {
  let component: HaAdminComponent;
  let fixture: ComponentFixture<HaAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HaAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HaAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
