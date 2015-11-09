'use strict';


/**
 Employee Service
 function create, fetchall, update , delete

 */
app.factory('EmployeeService', ['$http', '$q', function ($http, $q) {

    return {

        getEmployeeJobDetail: function (uuid) {
            return $http.get('/employee/getJobDetail/'+uuid).then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        },

        getEmployeePersonDetail: function (uuid) {
            return $http.get('/employee/getPersonDetail/'+uuid).then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        },

        getEmployeeByUserId: function (userId) {
            return $http.get('/employee/getbyUser/'+userId).then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        },

        fetchAllEmployee: function () {
            return $http.get('/employee/')
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    console.error('Error while fetching employee');
                    return $q.reject(errResponse);
                }
            );
        },

        getEmployee: function (id) {
            return $http.get('/employee/' + id)
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    console.error("Error whhile get Employee");
                    return $q.reject(errResponse);
                }
            );
        },

        createEmployee: function (employee) {
            return $http.post('/employee/', employee)
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    console.error('Error while creating employee');
                    return $q.reject(errResponse);
                }
            );
        },

        updateEmployee: function (employee, id) {
            return $http.put('/employee/' + id, employee)
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    console.error('Error while updating employee');
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