/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */
'use strict';

app.directive('previewQuestion', function () {
    return {
        restrict: 'EA',
        scope: {
            question: '='
        },
        template: "<div class=\"panel panel-default\"><div class=\"panel-heading\">{{question.name}}</div><div class=\"panel-body\" id=\"question_content\"></div></div>",
        replace: true,
        link: function (scope, elem) {


            var showQuestion = function () {
                var question = scope.question;
                var content = question.content;
                var obj =  angular.element(content);
                elem.find('#question_content').html("");
                elem.find('#question_content').append(obj);
            };

            scope.$watch(function (scope) {
                return scope.question.type;
            }, function () {
                showQuestion();
            });

        }
    };
});
app.controller('QuestionController', ['$scope', 'QuestionService', 'ngDialog', function ($scope, QuestionService, ngDialog) {

    $scope.question = {id: null, name: '', type: '', content: '', description: ''};
    //test
    $scope.questions = [
        {id: '1', name: 'questions1', type: 'text', content: '', description: ''},
        {id: '2', name: 'question2', type: 'select', content: '', description: ''},
        {id: '3', name: 'question3', type: 'textarea', content: '', description: ''}
    ];

    $scope.refreshAll = function () {
        QuestionService.fetchAllQuestions().then(function (response) {
                $scope.questions = response;
            },
            function (errResponse) {
                console.log("err when get all question");
                console.log(errResponse);
            }
        );
    };

    $scope.refreshAll();

    var dialog;
    $scope.ok = function () {
        $scope.typeChanged();
        if ($scope.create) {
            QuestionService.createQuestion($scope.question).then(function(response){
                $scope.refreshAll();
            });
        } else {
            QuestionService.updateQuestion($scope.question, $scope.question.id).then(function (response) {
                $scope.refreshAll();
            });
        }

        if (dialog) {
            dialog.close("");
        }
    };

    $scope.typeChanged = function () {
        var type = $scope.question.type;
        var content = "";
        switch (type) {
            case "text":
                content = '<plugin id="{+id+}"><input class="form-control" type=\"text\"></plugin>';
                break;
            case 'select':
                //TODO
                break;
        }
        $scope.question.content = content;
    };

    $scope.cancel = function () {
        if (dialog) {
            dialog.close("");
        }
    };

    $scope.types = ['textarea', "select", "text"];

    // when add a question button clicked
    $scope.createNew = function () {
        $scope.question = {id: null, name: '', type: '', content: ''};
        $scope.create = true;
        dialog = ngDialog.open({
            template: 'question-editor.html',
            scope: $scope
        })
    };
    // when edit form clicked
    $scope.editor = function (question) {
        $scope.question = question;
        $scope.create = false;
        dialog = ngDialog.open({
            template: 'question-editor.html',
            scope: $scope
        });
    };

    $scope.delete = function (question) {
        $scope.question = question;
        dialog = ngDialog.open({
            template: "question-delete.html",
            scope:$scope
        });
    };
    
    $scope.deleteOk = function () {
        QuestionService.deleteQuestion($scope.question.id).then(function (response) {
            $scope.refreshAll();
            $scope.cancel();
        });
    }

}])
;