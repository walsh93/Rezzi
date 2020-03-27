import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaChannelRequestsComponent } from './ra-channel-requests.component';

describe('RaChannelRequestsComponent', () => {
  let component: RaChannelRequestsComponent;
  let fixture: ComponentFixture<RaChannelRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaChannelRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaChannelRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
