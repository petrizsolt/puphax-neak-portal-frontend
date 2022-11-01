import { TestBed } from '@angular/core/testing';

import { PuphaxDataService } from './puphax-data.service';

describe('PuphaxDataService', () => {
  let service: PuphaxDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PuphaxDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
