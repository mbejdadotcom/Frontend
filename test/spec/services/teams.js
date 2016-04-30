'use strict';

describe('Service: teams', function () {

  // load the service's module
  beforeEach(module('ngdeployApp'));

  // instantiate service
  var teams;
  beforeEach(inject(function (_teams_) {
    teams = _teams_;
  }));

  it('should do something', function () {
    expect(!!teams).toBe(true);
  });

});
