'use strict';

app.factory('FormService', ['$http', '$q', function ($http, $q) {

    return {

        fetchAllWorkFlow: function () {
            return $http.get('/workflow/')
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

        fetchOneWorkFlow: function (id) {
            return $http.get('/workflow/id')
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

        createWorkFlow: function (wf) {
            return $http.post('/workflow/', wf)
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

        updateWorkFlow: function (wf, id) {
            return $http.put('/workflow/' + id, form)
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    console.error('Error while updating form');
                    return $q.reject(errResponse);
                }
            );
        },

        deleteWorkFlow: function (id) {
            return $http.delete('/workflow/' + id)
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