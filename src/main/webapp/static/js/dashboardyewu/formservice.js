'use strict';

app.factory('FormService', ['$http', '$q', function ($http, $q) {

    return {

        fetchAllForms: function () {
            return $http.get('/formtable/')
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

        fetchOneForm: function (id) {
            return $http.get('/formtable/id')
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

        createForm: function (form) {
            return $http.post('/formtable/', form)
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

        updateForm: function (form, id) {
            return $http.put('/formtable/' + id, form)
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

        deleteForm: function (id) {
            return $http.delete('/formtable/' + id)
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