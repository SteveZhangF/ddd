'use strict';


/**
 user department controller
 role: user
 function create, update

 */
app.controller('UserDepartmentController', ['$scope', 'DepartmentService', 'LoginService', function ($scope, DepartmentService, LoginService) {
    var self = this;
    self.department = {
        uuid: null,
        name: '',
        address: '',
        phone: '',
        formType: 'DepartmentForm',
        company_id: '',
        children: [],
    };



    self.createDepartment = function (department) {
        DepartmentService.createDepartment(department);
    };

    self.updateDepartment = function (department, uuid) {
        DepartmentService.updateDepartment(department, uuid);
    };


    self.submit = function () {
        if (self.department.uuid == null) {
            console.log('Saving New Department', self.department);
            self.createDepartment(self.department);
        } else {
            console.log('Department updated with id ', self.department.uuid);
            self.updateDepartment(self.department, self.department.uuid);
        }
        $scope.selected.operated = true;
        self.reset();
    };

    self.getDepartment = function(id){
        DepartmentService.getDepartment(id).then(
            function(response){
                self.department = response;
                self.department.parent_id = $scope.selected.parent_id;
                delete self.department.children;
            },
            function (errResponse) {
                console.log(errResponse);
            }
        );
    }

    self.deleteDepartment = function(id){
        DepartmentService.deleteDepartment(id).then(
            function (response) {
                console.log("delete department success");
                alert("Success!");
            },
            function (errResponse) {
                console.log("failed");
                alert("Failed");
            }
        );
        $scope.selected.operated = true;
    }

    self.reset = function () {
        //self.edit();
        $scope.myForm.$setPristine(); //reset Form
    };

    $scope.$watch(function ($scope) {
        return $scope.selected.id;
    }, function () {
        console.log($scope.selected);
        if($scope.selected.type=="DepartmentForm"){
            if($scope.selected.action=="remove"){
                self.deleteDepartment($scope.selected.id);
                $scope.selected.action = "";
            }else
            if($scope.selected.action=="add"){
                self.department = {
                    uuid: null,
                    name: '',
                    address: '',
                    phone: '',
                    formType: 'DepartmentForm',
                    company_id: $scope.selected.company_id,
                    children: [],
                    parent_id:$scope.selected.id
                };
                $scope.selected.action = "";
            }else
            if($scope.selected.action="edit"){
                self.getDepartment($scope.selected.id);
                $scope.selected.action="";
            }
        }


    });
}]);