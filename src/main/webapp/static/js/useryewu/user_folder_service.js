
'use strict';
app.factory('UserFolderService',['$http','$q', function ($http,$q) {

    return {
        getUserFolders: function (userId) {
            return $http.get('/user/folders/'+userId)
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        },

        getUserFile: function (fileId) {
            return $http.get('/user/folders/get/FILE/'+fileId)
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        },
        getUserQuestion: function (questionId) {
            return $http.get('/user/folders/get/QUESTION/'+questionId)
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        }
        ,

        getUserWorkFlowByFolderId: function (fileId) {
            return $http.get('/user/folders/folder/FLOW/'+fileId)
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        },

        getUserEmployeeReports: function (userId) {
            return $http.get('/user/folders/file/employee_reports/'+userId)
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        }

    }



}]);
