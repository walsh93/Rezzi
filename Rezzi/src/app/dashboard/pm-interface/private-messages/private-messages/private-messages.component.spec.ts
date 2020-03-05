import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateMessagesComponent } from './private-messages.component';

describe('PrivateMessagesComponent', () => {
  let component: PrivateMessagesComponent;
  let fixture: ComponentFixture<PrivateMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivateMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivateMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
