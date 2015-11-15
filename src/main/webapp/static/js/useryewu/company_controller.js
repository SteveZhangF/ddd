'use strict';


/**
 user company controller
 role: user
 function create, update

 */
app.directive('phone', function () {
    return {
        restrict: "A",
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {

            var pattern = /^\+?\d{2}[- ]?\d{3}[- ]?\d{5}$/;

            ctrl.$validators.phone = function (modelValue, viewValue) {
                if (ctrl.$isEmpty(modelValue)) {
                    return true;
                }
                return !!pattern.test(modelValue);
            };

        }
    };
});

app.controller("UserCompanyNavController", ['$scope', function ($scope) {
    $scope.companyMenu = [{name: "Company Information", subMenu: [], href: "user/company_edit.html"},
        {name: "Employee List", subMenu: [], href: "user/employee_list.html"}
    ];
    $scope.selectedMenu = $scope.companyMenu[0];
    $scope.menuSelect = function (menu) {
        angular.forEach($scope.companyMenu, function (itm) {
            itm.selected = itm.name === menu.name;
        });
        $scope.selectedMenu = menu;
    };
}])
;

app.controller('UserCompanyController', ['$scope', 'CompanyService', 'LoginService', 'usSpinnerService', function ($scope, CompanyService, LoginService, usSpinnerService) {

    /**
     * spinner start
     * */
    $scope.spinneractive = false;
    $scope.startSpin = function () {
        if (!$scope.spinneractive) {
            console.log('loading');
            usSpinnerService.spin('company-edit-spinner');
            $scope.spinneractive = true;
        }
    };
    $scope.stopSpin = function () {
        if ($scope.spinneractive) {
            console.log('stoped');
            usSpinnerService.stop('company-edit-spinner');
            $scope.spinneractive = false;
        }
    };

    /**
     * spanner end
     * */

    $scope.companyError = {hasError: {success: false, error: false}, msg: ''};

    $scope.loadingCompany = function () {
        $scope.startSpin();
        CompanyService.getCompanyByUserId(LoginService.getUserInfo().userId).then(function (response) {
            $scope.company = response;
            $scope.stopSpin();
            $scope.companyError.hasError.error = false;
            $scope.companyError.hasError.success = false;
        }, function (err) {
            $scope.companyError.hasError.error = true;
            $scope.companyError.hasError.success = false;
            $scope.companyError.msg = "Error while reading company, please try it later";
            $scope.stopSpin();
        });
    };

    //load company when ready
    angular.element(document).ready(function () {
        $scope.loadingCompany();
    });

    //update company information
    $scope.save = function () {
        $scope.startSpin();
        CompanyService.updateCompany($scope.company, $scope.company.uuid).then(function (response) {
            $scope.companyError.hasError.error = false;
            $scope.companyError.hasError.success = true;
            $scope.companyError.msg = "Success!";
            $scope.stopSpin();
        }, function (err) {
            $scope.companyError.hasError.error = true;
            $scope.companyError.hasError.success = false;
            $scope.companyError.msg = "Error while updating company, please try it later!";
            $scope.stopSpin();
        });
    };
}]);
