app.controller('userListCtrl', ['$scope',"UserService", function ($scope,UserService) {
    console.log("test user list in");
    var users = "[{\"id\":5,\"ssoId\":\"www\",\"password\":\"qqq\",\"companyId\":null,\"email\":\"wwwW2@we\"" +
        ",\"state\":\"Active\",\"userProfiles\":[]},{\"id\":6,\"ssoId\":\"ddd\",\"password\":\"www\",\"companyId\":null,\"email\":"+"\"ddd\",\"state\":\"Active\",\"userProfiles\":[]}]";
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

    //  fetchAllUsers();
    //for (var i=0; i<1000000; i++) {
    //    dp.push({
    //        index: i,
    //        label: "label " + i,
    //        value: "value " + i
    //    });
    //}
    for(var i=0;i<$scope.users.length;i++){
        $scope.users[i].index=i;
        $scope.users[i].label=$scope.users[i].ssoId;
    }
    this.dataProvider = $scope.users;
    if($scope.users.length!=0){
        this.selectedOption = users[0];
    }else{
        this.selectedOption = null;
    }


    this.onSelect = function (option) {
        console.log(option);
    };
}]),
    angular.module("dashboardApp");
