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
                };
                //$scope.data = [{id: company.id, type:"CompanyForm",title: company.label, nodes: company.departments}];
                $scope.selected = {type: "CompanyForm", id: "", title: ""};
                
                var format = function (json) {
                    json.type = json.formType;
                    json.id = json.uuid;
                    json.title = json.name;

                    for(var i=0;i<json.children.length;i++){
                        format(json.children[i]);
                        json.children[i].parent_id = json.id;
                    }
                    json.nodes = json.children;
                }
                $scope.refresh = function(){
                    $scope.data = [];
                    //$scope.data.push(company);
                    console.log("refresh");
                    
                    CompanyService.getCompanyByUserId(user_id).then(
                        function (response) {
                            company = response;

                            $scope.selected.id = company.uuid;
                            $scope.selected.title = company.name;
                            $scope.selected.type = company.formType;
                            $scope.selected.company_id = company.uuid;

                            format(company);
                            $scope.data.push(company);
                            

                        },
                        function (errResponse) {
                            //console.error("Error while get company by user id");
                            $scope.selected = {type: "CompanyForm", id: "", title: ""};
                        }
                    );
                }

                $scope.refresh();
                $scope.add = function (scope,type) {
                    console.log("add..."+type);
                    $scope.selected.id = scope.$modelValue.id;//parent id
                    $scope.selected.type = type;//add what
                    $scope.selected.action = "add";


                }

                $scope.edit = function (scope) {
                    console.log($scope.data);
                    $scope.selected.id = scope.$modelValue.id;
                    $scope.selected.type = scope.$modelValue.type;
                    $scope.selected.action = "edit";
                    $scope.selected.parent_id = scope.$modelValue.parent_id;
                    console.log($scope.selected.type);
                }

                $scope.removez = function (scope) {
                    alert("Sure?");
                    $scope.selected.id = scope.$modelValue.id;
                    $scope.selected.type = scope.$modelValue.type;
                    $scope.selected.action = "remove";
                };

                $scope.toggle = function (scope) {
                    scope.toggle();
                };

                $scope.collapseAll = function () {
                    $scope.$broadcast('collapseAll');
                };

                $scope.expandAll = function () {
                    $scope.$broadcast('expandAll');
                };

                $scope.$watch(function ($scope) {
                    return $scope.selected.operated;
                }, function () {
                    console.log($scope.selected);
                    if($scope.selected.operated){
                        $scope.refresh();
                        $scope.selected.operated = false;
                    }
                });

            }]);

}());
