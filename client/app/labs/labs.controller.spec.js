'use strict';

describe('Controller: LabsCtrl', function () {

  // load the controller's module
  beforeEach(module('labsApp'));

  var LabsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LabsCtrl = $controller('LabsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
