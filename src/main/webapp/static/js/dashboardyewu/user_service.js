'use strict';

app.factory('UserService', ['$http', '$q', function ($http, $q) {

    return {

        fetchAllUsers: function () {
            return $http.get('/admin/user/')
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        },
        createUser: function (user) {
            return $http.post('/admin/user/', user)
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    console.error('Error while creating user');
                    return $q.reject(errResponse);
                }
            );
        },

        updateUser: function (user, id) {
            return $http.put('/admin/user/' + id, user)
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    console.error('Error while updating user');
                    return $q.reject(errResponse);
                }
            );
        }

        //deleteUser: function (id) {
        //    return $http.delete('/user/' + id)
        //        .then(
        //        function (response) {
        //            return response.data;
        //        },
        //        function (errResponse) {
        //            console.error('Error while deleting user');
        //            return $q.reject(errResponse);
        //        }
        //    );
        //}

    };

}]);