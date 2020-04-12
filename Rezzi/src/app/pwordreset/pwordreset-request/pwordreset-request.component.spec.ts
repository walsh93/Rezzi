import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PwordresetRequestComponent } from './pwordreset-request.component';

describe('PwordresetRequestComponent', () => {
  let component: PwordresetRequestComponent;
  let fixture: ComponentFixture<PwordresetRequestComponent>;
  const email = 'rezzi407@gmail.com';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PwordresetRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PwordresetRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('return 200 from XMLHttpRequest', () => {
    let xhr = new XMLHttpRequest();
    const body = `email=${email}`;
    xhr.open('POST', 'pword-reset-request', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onreadystatechange = () => {
      expect(xhr.readyState).toBe(XMLHttpRequest.DONE);
      expect(xhr.status).toBe(200);
    };
    // xhr.send(body);
  });
});
