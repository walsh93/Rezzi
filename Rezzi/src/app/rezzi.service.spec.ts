import { TestBed } from '@angular/core/testing';

import { RezziService } from './rezzi.service';

describe('RezziService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RezziService = TestBed.get(RezziService);
    expect(service).toBeTruthy();
  });
});
