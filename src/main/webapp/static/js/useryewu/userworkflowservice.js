/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

'use strict';

app.factory('UserWorkFlowService', ['$http', '$q','LoginService' ,function ($http, $q,LoginService) {

    return {

        fetchAllWorkFlow: function () {
            var userId = LoginService.getUserInfo().userId;
            return $http.get('/user/getworkflow/'+userId)
                .then(
                function (response) {
                    console.log(response.data);
                    return response.data;
                },
                function (errResponse) {
                    console.error('Error while fetching users');
                    return $q.reject(errResponse);
                }
            );
        },
        //however, here i have to user put instead of get
        getCurrentNode: function (id) {
            return $http.get('/user/workflownode/'+id)
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
        
        goToNode: function (userWorkflow) {
            return $http.put('/user/workflow/go/',userWorkflow).then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        },

        submitRecord: function (record) {
            return $http.post('/user/workflow/submit/',record).then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        },

        getRecordValue: function (record) {
            return $http.post("/user/workflow/value/",record).then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        }

    };

}]);