import { TestBed } from '@angular/core/testing';

import { NgxGuildyService } from './ngx-guildy.service';

describe('NgxGuildyService', () => {
  let service: NgxGuildyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxGuildyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
