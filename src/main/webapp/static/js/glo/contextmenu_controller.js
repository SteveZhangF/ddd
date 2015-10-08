'use strict';
app.controller('ContextmenuController', [
  '$scope',
  function ($scope) {
		 $scope.companyMenu = [
		                       ['Edit', function ($itemScope) {
		                          console.log("edit company"+$scope.organzation.uuid);
		                          console.log($itemScope);
		                          $scope.org_selected($scope.organzation);
		                          $scope.refreshTree();
		                       }],
		                       null,
		                       ['Add Department', function ($itemScope) {
		                          console.log('add department');
		                          
		                       }]
		                   ];
  }
]);
