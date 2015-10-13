/**
 * Created by steve on 10/10/15.
 */
var app = angular.module("dashboardApp");
app.controller('userTableCtrl', ['$scope',"$filter", "UserService", function ($scope, UserService,filter) {
    console.log("test user table in");
    var users = "[{\"id\":5,\"ssoId\":\"www\",\"password\":\"qqq\",\"companyId\":null,\"email\":\"wwwW2@we\"" +
        ",\"state\":\"Active\",\"userProfiles\":[]},{\"id\":6,\"ssoId\":\"ddd\",\"password\":\"www\",\"companyId\":null,\"email\":" + "\"ddd\",\"state\":\"Active\",\"userProfiles\":[]}]";
    $scope.users = JSON.parse(users);

    self.fetchAllUsers = function () {
        UserService.fetchAllUsers()
            .then(
            function (d) {
                $scope.users = d;
            },
            function (errResponse) {
                console.error('Error while fetching Currencies');
            }
        );
    };

    $scope.editor = function(id){
        console.log(id);

    }
}]);

