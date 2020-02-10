import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaAdminComponent } from './ra-admin.component';

describe('RaAdminComponent', () => {
  let component: RaAdminComponent;
  let fixture: ComponentFixture<RaAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
