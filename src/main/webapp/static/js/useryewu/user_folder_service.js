
'use strict';
app.factory('UserFolderService',['$http','$q', function ($http,$q) {

    return {
        getUserFolders: function (userId) {
            return $http.get('/user/folders/'+userId)
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        }

    }



}]);
