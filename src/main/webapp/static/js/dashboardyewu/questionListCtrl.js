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
                console.log(JSON.stringify(scope.question).length);
                var question = scope.question;
                var content = question.content;
                var obj = angular.element(content);
                if (question.options) {
                    for (var i = 0; i < question.options.length; i++) {
                        var opt;
                        if (question.type == 'select') {
                            opt = angular.element("<option></option>");
                            opt.attr("value", question.options[i].value);
                            opt.text(question.options[i].name);
                            obj.find('select').append(opt);
                        }else
                        if(question.type=="checkbox"){
                            //<label class="form-control"><input type="checkbox" value="ddd" > ddd</label>
                            opt = angular.element("<label class=\"form-control\"><input type=\"checkbox\" value=\""+question.options[i].value+"\">"+question.options[i].name+"</label>");
                            obj.append(opt);
                        }
                    }
                }
                elem.find('#question_content').html("");
                elem.find('#question_content').append(obj);
            };

            scope.$watch(function (scope) {
                return JSON.stringify(scope.question).length;
            }, function () {
                showQuestion();
            });

        }
    };
});
app.controller('QuestionController', ['$scope', 'QuestionService', 'ngDialog', function ($scope, QuestionService, ngDialog) {

    $scope.question = {id: null, name: '', type: '', content: '', description: '', options: []};
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
            QuestionService.createQuestion($scope.question).then(function (response) {
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

// {
//    id: '2',
//    index: '1',
//    label: 'question2',
//    type: 'select',
//    name: 'question2',
//    content: '<plugin><textarea class="form-control"/></plugin>'
//}, {
//    id: '3',
//    index: '2',
//    label: 'question3',
//    type: 'checkbox',
//    name: 'question3',
//    content: '<plugin><label class="form-control"><input type="checkbox" value="ddd" > ddd</label><label class="form-control"><input type="checkbox"> sss</label></plugin>'
//}, {
//
//    id: '4',
//    index: '3',
//    label: 'question4',
//    type: 'select',
//    name: 'question4',
//    content: '<plugin><select name="singleSelect" class="form-control" ng-model="data.singleSelect"><option value="option-1" > Option 1</option><option value="option-2" > Option 2</option></select></plugin>'

    $scope.typeChanged = function () {
        var type = $scope.question.type;
        var content = "";
        switch (type) {
            case "text":
                content = '<plugin id="{+id+}"><input class="form-control" type=\"text\"></plugin>';
                break;
            case 'textarea':
                content = '<plugin id="{+id+}"><textarea class="form-control"/></plugin>';
                break;
            case 'select':
                content = '<plugin id="{+id+}"><select class="form-control"></select></plugin>';
                break;
            case 'checkbox':
                content = '<plugin id="{+id+}"></plugin>';

        }
        $scope.question.content = content;
    };


    $scope.newOp = {name: '', value: ''};
    $scope.addOption = function () {
        if (!$scope.question.options) {
            $scope.question.options = [];
        }
        $scope.question.options.push({name: $scope.newOp.name, value: $scope.newOp.value});
        $scope.newOp.name = '';
        $scope.newOp.value = '';
    };

    $scope.removeOption = function (i) {
        $scope.question.options.splice(i, 1);
    }

    $scope.cancel = function () {
        if (dialog) {
            dialog.close("");
        }
    };
    //<label class="form-control"><input type="checkbox" value="ddd" > ddd</label>
    $scope.types = ['textarea', "select", "text","checkbox"];

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
            scope: $scope
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