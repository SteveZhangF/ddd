/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

'use strict';
app.factory('UserEmploymentStatusService',['$http','$q','LoginService', function ($http,$q) {

    return {
        getEmploymentStatusByUserId: function (userId) {
            return $http.get('/employmentStatus/user/' + userId)
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        },

        deleteEmploymentStatus: function (jtId) {
            return $http.post('/employmentStatus/delete/', jtId).then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        },

        saveEmploymentStatus: function (jt) {
            return $http.post('/employmentStatus/', jt).then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        },

        updateEmploymentStatus: function (jt) {
            return $http.put('/employmentStatus/', jt).then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            )
        }
    }



}]);



app.factory('UserJobTitleService', ['$http', '$q','LoginService' ,function ($http, $q) {

    return {

        getJobTitleByUserId: function (userId) {
            return $http.get('/jobtitles/user/'+userId)
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        },
        
        deleteJobTitles: function (jtId) {
            return $http.post('/jobtitles/delete/',jtId).then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        },

        saveJobTitle: function (jt) {
            return $http.post('/jobtitles/',jt).then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        },

        updateJobTitle: function (jt) {
            return $http.put('/jobtitles/',jt).then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            )
        }
    };

}]);