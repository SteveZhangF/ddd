'use strict';

app.factory('QuestionService', ['$http', '$q', function ($http, $q) {

    return {

        fetchAllQuestions: function () {
            return $http.get('/question/')
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
        createQuestion: function (question) {
            return $http.post('/question/', question)
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

        updateQuestion: function (question, id) {
            return $http.put('/question/' + id, question)
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    console.error('Error while updating question');
                    return $q.reject(errResponse);
                }
            );
        },

        deleteQuestion: function (id) {
            return $http.delete('/question/' + id)
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