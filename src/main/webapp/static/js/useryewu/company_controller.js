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

    CompanyService.getCompany($scope.selected.id).then(
        function(response){
            self.company = response.data;
        },
        function (errResponse) {

        }
    );

    var userInfo;
    // userInfo = {
    //       accessToken : result.data.access_token,
    //       userName : result.data.userName,
    //       userId : result.data.userId,
    //       companyId : result.data.companyId
    //     };

    self.createCompany = function (company) {
        CompanyService.createCompany(company).then(function (response) {
                LoginService.getUserInfo().companyId = response.uuid;
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
        if (self.company.uuid == null) {
            console.log('Saving New Company', self.company);
            self.company.user_id = userInfo.userId;
            self.createCompany(self.company);
        } else {
            console.log('Company updated with id ', self.company.uuid);
            self.updateCompany(self.company, self.company.uuid);
        }

        //self.reset();
    };

    self.edit = function () {

        //get the user's information
        userInfo = LoginService.getUserInfo();

        if (userInfo.companyId) {
            CompanyService.getCompany(userInfo.companyId).then(
                function (d) {
                    self.company = d;
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
    // load the company from server
    self.edit();

}]);
