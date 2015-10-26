'use strict';

app.factory('UserQuestionService', ['$http', '$q', function ($http, $q) {

    return {

        fetchOneQuestion: function (id) {
          return $http.get('/question/'+id)
              .then(
              function (response) {
                  return response.data
              },
              function (errResponse) {
                  return $q.reject(errResponse);
              }
          );
        },
    };

}]);