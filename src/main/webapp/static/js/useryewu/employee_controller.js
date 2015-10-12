'use strict';


/**
 user employee controller
 role: user
 function create, update

 */
app.controller('UserEmployeeController', ['$scope', 'EmployeeService', 'LoginService', function ($scope, EmployeeService, LoginService) {
    var self = this;
    self.employee = {
        uuid: null,
        name: '',
        address: '',
        phone: '',
        formType: '',
        employee: '',
        department: '',
        employee: ''
    };
    var userInfo;
    // userInfo = {
    //       accessToken : result.data.access_token,
    //       userName : result.data.userName,
    //       userId : result.data.userId,
    //       companyId : result.data.companyId
    //     };

    self.createEmployee = function (employee) {
        EmployeeService.createEmployee(employee);
    };

    self.updateEmployee = function (employee, uuid) {
        EmployeeService.updateEmployee(employee, uuid);
    };


    self.submit = function () {
        if (self.employee.uuid == null) {
            console.log('Saving New Employee', self.employee);
            self.createEmployee(self.employee);
        } else {
            console.log('Employee updated with id ', self.employee.uuid);
            self.updateEmployee(self.employee, self.employee.uuid);
        }
        self.reset();
    };

    self.edit = function () {

        //get the user's information
        $scope.employee_id = $scope.organzation.id;
        if ($scope.employee_id) {
            EmployeeService.getEmployee($scope.employee_id).then(
                function (d) {
                    self.employee = d;
                },
                function (errResponse) {
                    console.error('Error while fetching Currencies');
                }
            );
        }

    };

    self.reset = function () {
        self.edit();
        $scope.myForm.$setPristine(); //reset Form
    };
    // load the employee from server
    self.edit();

}]);