'use strict';


/**
 Company Service
 function create, fetchall, update , delete

 */
app.factory('CompanyService', ['$http', '$q', function ($http, $q) {

    return {

        fetchAllCompany: function () {
            return $http.get('/company/')
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    console.error('Error while fetching company');
                    return $q.reject(errResponse);
                }
            );
        },

        getCompany: function (id) {
            return $http.get('/company/' + id)
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    console.error("Error whhile get Company");
                    return $q.reject(errResponse);
                }
            );
        },

        getCompanyByUserId: function(user_id){
            return $http.get('/company/getbyuserid/'+user_id)
                .then(
                function(response){
                    return response.data;
                },
                function (errResponse){
                    console.error("Error while get company by user id");
                    return $q.reject(errResponse);
                }
            )
        },

        createCompany: function (company) {
            console.log(company);
            return $http.post('/company/', company)
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    console.error('Error while creating company');
                    return $q.reject(errResponse);
                }
            );
        },

        updateCompany: function (company, id) {
            return $http.put('/company/' + id, company)
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    console.error('Error while updating company');
                    return $q.reject(errResponse);
                }
            );
        },

        deleteCompany: function (id) {
            return $http.delete('/company/' + id)
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    console.error('Error while deleting company');
                    return $q.reject(errResponse);
                }
            );
        }

    };

}]);