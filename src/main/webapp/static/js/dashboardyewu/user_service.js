'use strict';

app.factory('UserService', ['$http', '$q', function ($http, $q) {

    return {

        fetchAllUsers: function () {
            return $http.get('/user/')
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    console.error('Error while fetching users');
                    return $q.reject(errResponse);
                }
            );
        },
        updateUserWorkflow : function (id,workflows) {
            return $http.post('/user/'+id,workflows).then(
                function (response) {
                    alert("success");
                },
                function (errResponse) {
                    alert("failed, please try later");
                }
            );
        },
        createUser: function (user) {
            return $http.post('/user/', user)
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
            return $http.put('/user/' + id, user)
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    console.error('Error while updating user');
                    return $q.reject(errResponse);
                }
            );
        },

        deleteUser: function (id) {
            return $http.delete('/user/' + id)
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    console.error('Error while deleting user');
                    return $q.reject(errResponse);
                }
            );
        }

    };

}]);