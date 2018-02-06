import { async, TestBed, inject } from '@angular/core/testing';
import { of as observableOf } from 'rxjs/observable/of';

import { NbRoleProvider } from './role.provider';
import { NbAclService } from './acl.service';
import { NbAuthorizationChecker } from './authorization-checker.service';

let authorizationChecker: NbAuthorizationChecker;

function setupAcl(can) {
  beforeEach(() => {
    // Configure testbed to prepare services
    TestBed.configureTestingModule({
      providers: [
        {
          provide: NbRoleProvider,
          useValue: {
            getRole: () => {
              return observableOf('admin');
            },
          },
        },
        {
          provide: NbAclService,
          useValue: {
            can: (role, permission, resource) => {
              return can; // this is a simple mocked ACL implementation
            },
          },
        },
        NbAuthorizationChecker,
      ],
    });
  });

  // Single async inject to save references; which are used in all tests below
  beforeEach(async(inject(
    [NbAuthorizationChecker],
    (_authorizationChecker) => {
      authorizationChecker = _authorizationChecker
    },
  )));
}

describe('authorization checker', () => {

  describe('acl returns true', () => {
    setupAcl(true);

    it(`checks against provided role`, (done) => {
      authorizationChecker.isGranted('delete', 'users').subscribe((result: boolean) => {
        expect(result).toBe(true);
        done();
      })
    });
  });

  describe('acl returns false', () => {
    setupAcl(false);

    it(`checks against provided role`, (done) => {
      authorizationChecker.isGranted('delete', 'users').subscribe((result: boolean) => {
        expect(result).toBe(false);
        done();
      })
    });
  });
});
