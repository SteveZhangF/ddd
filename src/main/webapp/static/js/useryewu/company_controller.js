'use strict';


/**
 user company controller
 role: user
 function create, update

 */
app.controller('UserCompanyController', ['$scope', 'CompanyService', 'LoginService', function ($scope, CompanyService, LoginService) {
    var self = this;
    self.company = {
        "uuid": null,
        "address": "",
        "phone": "",
        "name": "",
        "formType": "",
        "company_id": "",
        "children": [],
        "user_id": null
    }


    self.createCompany = function (company) {
        CompanyService.createCompany(company).then(function (response) {
                //LoginService.getUserInfo().companyId = response.uuid;
                LoginService.refreshUserInfo();
                console.log(LoginService.getUserInfo().companyId);
            },
            function (errResponse) {
                console.error('Error while fetching company');
            });

    };

    self.updateCompany = function (company, uuid) {
        CompanyService.updateCompany(company, uuid);
    };


    self.submit = function () {
        var userInfo = LoginService.getUserInfo();
        if (self.company.uuid == null) {
            console.log('Saving New Company', self.company);
            self.company.user_id = userInfo.userId;
            self.createCompany(self.company);
        } else {
            console.log('Company updated with id ', self.company.uuid);
            self.updateCompany(self.company, self.company.uuid);
        }
        $scope.selected.operated = true;
        self.reset();
    };


    self.getCompany = function (id) {
        CompanyService.getCompany(id).then(
            function (d) {
                self.company = d;
                delete self.company.children;
            },
            function (errResponse) {
                console.error('Error while fetching Currencies');
            }
        );
    }

    self.reset = function () {
        //self.edit();
        $scope.myForm.$setPristine(); //reset Form
    };

    $scope.$watch(function ($scope) {
        return $scope.selected;
    }, function () {
        console.log($scope.selected);
        if ($scope.selected.type == "CompanyForm") {
            if ($scope.selected.id == "") {
                self.company = {
                    "uuid": null,
                    "address": "",
                    "phone": "",
                    "name": "",
                    "formType": "CompanyForm",
                    "company_id": "",
                    "children": [],
                    "user_id": null
                }
            } else {
                self.getCompany($scope.selected.id);
            }
        }
    });

}]);
