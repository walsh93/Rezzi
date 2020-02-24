import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorDrawerComponent } from './floor-drawer.component';

describe('FloorDrawerComponent', () => {
  let component: FloorDrawerComponent;
  let fixture: ComponentFixture<FloorDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FloorDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FloorDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
