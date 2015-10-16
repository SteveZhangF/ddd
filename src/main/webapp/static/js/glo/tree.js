'use strict';
(function () {
    var app = angular.module('clientApp');
    app
        .controller(
        'UserOgnzTreeController',
            ['$scope',
                '$timeout',
                'CompanyService', 'LoginService',
            function ($scope, $timeout, CompanyService, LoginService) {
                var user_id = LoginService.getUserInfo().userId;
                var company = {
                    id: "1",
                    title: "company",
                    type: "CompanyForm",
                    nodes: [{id: 'd1',type:"DepartmentForm" ,label: 'dapartment1'}]
                };
                //$scope.data = [{id: company.id, type:"CompanyForm",title: company.label, nodes: company.departments}];
                $scope.data = [];
                $scope.data.push(company);
                CompanyService.getCompanyByUserId(user_id).then(
                    function (response) {
                        company = response;
                    },
                    function (errResponse) {
                        //console.error("Error while get company by user id");
                        $scope.selected = {type: "CompanyForm", id: "", title: ""};
                    }
                );
                $scope.selected = company;

                $scope.addDepartment = function () {
                }

                $scope.addEmployee = function () {
                }

                $scope.removeEmployee = function () {
                }

                $scope.removeDepartment = function () {
                }
                $scope.edit = function (scope) {
                    console.log($scope.data);
                    $scope.selected.id = scope.$modelValue.id;
                    $scope.selected.type = scope.$modelValue.type;
                    console.log($scope.selected.type);
                }

                $scope.removez = function (scope) {
                    console.log("remove");
                    console.log(scope.data);

                    console.log(scope.$modelValue);
                };

                $scope.toggle = function (scope) {
                    scope.toggle();
                };

                $scope.moveLastToTheBeginning = function () {
                    var a = $scope.data.pop();
                    $scope.data.splice(0, 0, a);
                };

                $scope.newSubItem = function (scope) {
                    var nodeData = scope.$modelValue;
                    nodeData.nodes.push({
                        id: nodeData.id * 10 + nodeData.nodes.length,
                        title: nodeData.title + '.' + (nodeData.nodes.length + 1),
                        nodes: []
                    });
                };

                $scope.collapseAll = function () {
                    $scope.$broadcast('collapseAll');
                };

                $scope.expandAll = function () {
                    $scope.$broadcast('expandAll');
                };


            }]);

}());
