/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

'use strict';
app.factory('UserFormRecordService',['$http','$q', function ($http,$q) {

    return {
        getFormRecords: function (user_id,oe_id,qIds) {
            return $http.post('/user/form/record/'+user_id+'/'+oe_id,qIds)
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        },

        getAllQuestions: function (form_id) {
            return $http.get('/user/form/questions/'+form_id)
                .then(
                function (response) {
                    return response.data;
                },
                function (err) {
                    return $q.reject(err);
                }
            );
        },
        
        saveQuestionValues: function (records) {
            return $http.post('/user/form/saveValue/',records)
                .then(
                function (response) {
                    return response.data;
                },
                function (err) {
                    return $q.reject(err);
                }
            );
        }
    }



}]);

