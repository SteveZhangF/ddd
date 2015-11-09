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

            var pattern=/^\+?\d{2}[- ]?\d{3}[- ]?\d{5}$/;

            ctrl.$validators.phone = function (modelValue, viewValue) {
                if (ctrl.$isEmpty(modelValue)) {
                    return true;
                }
                return !!pattern.test(modelValue);
            };

        }
    };
});
app.controller('UserCompanyController', ['$scope', 'CompanyService', 'LoginService','usSpinnerService' ,function ($scope, CompanyService, LoginService,usSpinnerService) {

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

    $scope.companyError = {hasError:false,msg:''};

    $scope.loadingCompany = function () {
        $scope.startSpin();
        CompanyService.getCompanyByUserId(LoginService.getUserInfo.userId).then(function (response) {
            $scope.company = response;
            $scope.stopSpin();
        }, function (err) {
            $scope.companyError.hasError = true;
            $scope.companyError.msg = "Error while reading company, please try it later";
        });
    };

    //$scope.loadingCompany();


    $scope.save = function () {
        console.log($scope.company);
    };
    //
    //
    //
    //
    //var self = this;
    //self.company = {
    //    "uuid": null,
    //    "address": "",
    //    "phone": "",
    //    "name": "",
    //    "formType": "",
    //    "company_id": "",
    //    "children": [],
    //    "user_id": null
    //};
    //
    //
    //self.createCompany = function (company) {
    //    CompanyService.createCompany(company).then(function (response) {
    //            //LoginService.getUserInfo().companyId = response.uuid;
    //            LoginService.refreshUserInfo();
    //            console.log(LoginService.getUserInfo().companyId);
    //        },
    //        function (errResponse) {
    //            console.error('Error while fetching company');
    //        });
    //
    //};
    //
    //self.updateCompany = function (company, uuid) {
    //    CompanyService.updateCompany(company, uuid);
    //};
    //
    //
    //self.submit = function () {
    //    var userInfo = LoginService.getUserInfo();
    //    if (self.company.uuid == null) {
    //        console.log('Saving New Company', self.company);
    //        self.company.user_id = userInfo.userId;
    //        self.createCompany(self.company);
    //    } else {
    //        console.log('Company updated with id ', self.company.uuid);
    //        self.updateCompany(self.company, self.company.uuid);
    //    }
    //    $scope.selected.operated = true;
    //    self.reset();
    //};
    //
    //
    //self.getCompany = function (id) {
    //    CompanyService.getCompany(id).then(
    //        function (d) {
    //            self.company = d;
    //            delete self.company.children;
    //        },
    //        function (errResponse) {
    //            console.error('Error while fetching Currencies');
    //        }
    //    );
    //}
    //
    //self.reset = function () {
    //    //self.edit();
    //    $scope.myForm.$setPristine(); //reset Form
    //};
    //
    //$scope.$watch(function ($scope) {
    //    return $scope.selected;
    //}, function () {
    //    console.log($scope.selected);
    //    if ($scope.selected.type == "CompanyForm") {
    //        if ($scope.selected.id == "") {
    //            self.company = {
    //                "uuid": null,
    //                "address": "",
    //                "phone": "",
    //                "name": "",
    //                "formType": "CompanyForm",
    //                "company_id": "",
    //                "children": [],
    //                "user_id": null
    //            }
    //        } else {
    //            self.getCompany($scope.selected.id);
    //        }
    //    }
    //});

}]);
