'use strict';


/**
 user employee controller
 role: user
 function create, update, delete

 */
app.controller('UserEmployeeController', ['$scope', 'EmployeeService', 'LoginService', function ($scope, EmployeeService, LoginService) {
    var self = this;
    self.employee = {
        uuid: null,
        name: '',
        address: '',
        phone: '',
        formType: 'EmployeeForm',

    };

    self.getEmployee = function (id) {
        EmployeeService.getEmployee(id).then(
            function (response) {
                self.employee = response.data;
                self.employee.parent_id = $scope.selected.parent_id;
                delete self.employee.children;

            },
            function (errResponse) {
                alert("Error");
            }
        );
    }

    self.createEmployee = function (employee) {
        EmployeeService.createEmployee(employee);
    };

    self.updateEmployee = function (employee, uuid) {
        EmployeeService.updateEmployee(employee, uuid);
    };

    self.deleteEmployee = function (id) {
        EmployeeService.deleteEmployee(id).then(
            function (response) {
                alert("success");
            },
            function (errResponse) {
                alert("failed");

            }
        );
        $scope.selected.operated = true;
    }
    self.submit = function () {
        if (self.employee.uuid == null) {
            console.log('Saving New Employee', self.employee);
            self.createEmployee(self.employee);
        } else {
            console.log('Employee updated with id ', self.employee.uuid);
            self.updateEmployee(self.employee, self.employee.uuid);
        }
        $scope.selected.operated = true;
        self.reset();
    };

    self.reset = function () {
        $scope.myForm.$setPristine(); //reset Form
    };


    $scope.$watch(function ($scope) {
        return $scope.selected.id;
    }, function () {
        console.log($scope.selected);
        if ($scope.selected.type == "EmployeeForm") {
            if ($scope.selected.action == "remove") {
                self.deleteEmployee($scope.selected.id);
                $scope.selected.action="";
            } else if ($scope.selected.action == "add") {
                self.employee = {
                    uuid: null,
                    name: '',
                    address: '',
                    phone: '',
                    formType: 'EmployeeForm',
                    company_id:$scope.selected.company_id,
                    parent_id:$scope.selected.parent_id
                };
                $scope.selected.action="";
            } else
            if ($scope.selected.action="edit"){
                self.getEmployee($scope.selected.id);
                $scope.selected.action="";
            }
        }
    });

}]);