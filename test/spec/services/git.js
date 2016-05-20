'use strict';

describe('Service: git', function () {

  // load the service's module
  beforeEach(module('ngdeployApp'));

  // instantiate service
  var git;
  beforeEach(inject(function (_git_) {
    git = _git_;
  }));

  it('should do something', function () {
    expect(!!git).toBe(true);
  });

});
