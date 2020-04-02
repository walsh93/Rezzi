import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HdNotificationsComponent } from './hd-notifications.component';

describe('HdNotificationsComponent', () => {
  let component: HdNotificationsComponent;
  let fixture: ComponentFixture<HdNotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HdNotificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HdNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
