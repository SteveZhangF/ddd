'use strict';


/**
 Employee Service
 function create, fetchall, update , delete

 */
app.factory('EmployeeService', ['$http', '$q', function ($http, $q) {

    return {

        getEmployeeByUserId: function (userId) {
            ///user/{userId}/employee/
            return $http.get('/user/'+userId+'/employee/').then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        },

        getEmployee: function (userId,id) {
            return $http.get('/user/'+userId+'/employee/' + id)
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        },

        createEmployee: function (userId,employee) {
            return $http.post('/user/'+userId+'/employee/', employee)
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        },

        updateEmployee: function (userId,employee, id) {
            return $http.put('/user/'+userId+'/employee/' + id, employee)
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        },

        deleteEmployee: function (id) {
            return $http.delete('/employee/' + id)
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    console.error('Error while deleting employee');
                    return $q.reject(errResponse);
                }
            );
        },
        
        deleteEmployees: function (ids) {
            return $http.post('/employee/deleteMany/',ids)
                .then(
                function (response) {
                    return response.data;
                },
                function (err) {
                    return $q.reject(err);
                }
            );
        }

    };

}]);