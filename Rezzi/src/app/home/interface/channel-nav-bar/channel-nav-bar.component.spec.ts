import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelNavBarComponent } from './channel-nav-bar.component';

describe('ChannelNavBarComponent', () => {
  let component: ChannelNavBarComponent;
  let fixture: ComponentFixture<ChannelNavBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelNavBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
