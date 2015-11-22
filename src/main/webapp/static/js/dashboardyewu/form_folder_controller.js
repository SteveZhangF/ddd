app.controller('FormFolderTreeController', ['$scope', '$filter', 'FolderService', 'FormService', 'usSpinnerService', '$timeout', function ($scope, $filter, FolderService, FormService, usSpinnerService, $timeout) {





    $scope.folders = [{"id":"0","description":"I am a root folder, please don't delete me!","createTime":1447836224000,"updateTime":1447894246000,"name":"Root","level":0,"leaf":false,"parent_id":null,"data_id":"0","dataType":"Folder","deleted":false,"children":[{"id":"40288085511a511601511a95544b0000","description":"dsa","createTime":1447849973000,"updateTime":1447888279000,"name":"asd","level":1,"leaf":true,"parent_id":"0","data_id":"17","dataType":"File","deleted":false,"children":[]},{"id":"40288085511ad3e801511cb919790000","description":"d","createTime":1447885871000,"updateTime":1447888282000,"name":"d","level":1,"leaf":true,"parent_id":"0","data_id":"18","dataType":"File","deleted":false,"children":[]},{"id":"40288085511cbdaf01511cc05f240000","description":"this is asdffffd folder","createTime":1447886348000,"updateTime":1447986846000,"name":"asdffffd","level":1,"leaf":false,"parent_id":"0","data_id":"0","dataType":"Folder","deleted":false,"children":[{"id":"40288085511cc5c301511cdf03c70000","description":"","createTime":1447888356000,"updateTime":1447951787000,"name":"testcreattime","level":2,"leaf":true,"parent_id":"40288085511cbdaf01511cc05f240000","data_id":"19","dataType":"File","deleted":false,"children":[]},{"id":"40288085511d2d8101511d2eb7cc0000","description":"ddd","createTime":1447893580000,"updateTime":1447894160000,"name":"dddd","level":2,"leaf":false,"parent_id":"40288085511cbdaf01511cc05f240000","data_id":"0","dataType":"Folder","deleted":false,"children":[]},{"id":"40288085511d2d8101511d2ecf580001","description":"sssddd","createTime":1447893586000,"updateTime":1447893586000,"name":"ddddwww","level":2,"leaf":false,"parent_id":"40288085511cbdaf01511cc05f240000","data_id":"0","dataType":"Folder","deleted":false,"children":[]},{"id":"40288085511d2d8101511d2ee0b90002","description":"sssdddqqw","createTime":1447893590000,"updateTime":1447893674000,"name":"ddddwwwaaq","level":2,"leaf":false,"parent_id":"40288085511cbdaf01511cc05f240000","data_id":"0","dataType":"Folder","deleted":false,"children":[]}]}]}];
    $scope.menu = {};
    $scope.thisFolder = {"id":"40288085511cbdaf01511cc05f240000","description":"this is asdffffd folder","createTime":1447886348000,"updateTime":1447986846000,"name":"asdffffd","level":1,"leaf":false,"parent_id":"0","data_id":"0","dataType":"Folder","deleted":false,"children":[{"id":"40288085511cc5c301511cdf03c70000","description":"","createTime":1447888356000,"updateTime":1447951787000,"name":"testcreattime","level":2,"leaf":true,"parent_id":"40288085511cbdaf01511cc05f240000","data_id":"19","dataType":"File","deleted":false,"children":[]},{"id":"40288085511d2d8101511d2eb7cc0000","description":"ddd","createTime":1447893580000,"updateTime":1447894160000,"name":"dddd","level":2,"leaf":false,"parent_id":"40288085511cbdaf01511cc05f240000","data_id":"0","dataType":"Folder","deleted":false,"children":[]},{"id":"40288085511d2d8101511d2ecf580001","description":"sssddd","createTime":1447893586000,"updateTime":1447893586000,"name":"ddddwww","level":2,"leaf":false,"parent_id":"40288085511cbdaf01511cc05f240000","data_id":"0","dataType":"Folder","deleted":false,"children":[]},{"id":"40288085511d2d8101511d2ee0b90002","description":"sssdddqqw","createTime":1447893590000,"updateTime":1447893674000,"name":"ddddwwwaaq","level":2,"leaf":false,"parent_id":"40288085511cbdaf01511cc05f240000","data_id":"0","dataType":"Folder","deleted":false,"children":[]}]}

    var folderMenu = {
        all: [{name: 'Edit', url: 'dashboard/folder_edit.html', selected: true}, {
            name: "Files",
            url: 'dashboard/folder_files.html'
        }, {name: 'Questions', url: 'dashboard/folder_questions.html'}, {
            name: 'Flows',
            url: 'dashboard/folder_flow.html'
        },
            {name:'Customized Element',url:'dashboard/folder_customized_element.html'}

        ], selectedMenu: {}
    };

    var fileMenu = {
        all: [
            {
                name: 'Edit', url: 'dashboard/folder_edit_file.html', selected: true
            }
        ],
        selectedMenu: {}
    };

    $scope.selectMenu = function (m) {
        angular.forEach($scope.menu, function (mi) {
            mi.selected = false;
        });
        m.selected = true;
        $scope.menu.selectedMenu = m;
    };

    /**
     * spinner start
     * */

    $scope.errorMsg = {hasMsg: false, isError: false, msg: ''};
    $scope.spinneractive = false;
    $scope.startSpin = function () {
        if (!$scope.spinneractive) {
            usSpinnerService.spin('folder-spinner');
            $scope.spinneractive = true;
        }
    };
    $scope.stopSpin = function (flag, msg) {
        if ($scope.spinneractive) {
            usSpinnerService.stop('folder-spinner');
            $scope.errorMsg.hasMsg = true;
            $scope.errorMsg.isError = !flag;
            $scope.errorMsg.msg = msg;
            $scope.spinneractive = false;
        }
    };

    $scope.$watch('modelTree.currentNode', function (newObj, oldObj) {
        if ($scope.modelTree && angular.isObject($scope.modelTree.currentNode)) {
            $scope.loadFolder($scope.modelTree.currentNode);
        }
    }, false);

    $scope.loadFolderTree = function () {
        $scope.startSpin();
        FolderService.getFolderTree().then(
            function (data) {
                $scope.folders = [];
                $scope.folders.push(data);
                $scope.stopSpin(true, 'success');
                if ($scope.modelTree.currentNode) {
                    $scope.loadFolder($scope.modelTree.currentNode);
                } else {
                    $scope.loadFolder({id: "0"});
                }
            },
            function (err) {
                $scope.stopSpin(false, 'load folder tree failed, please try later');
            }
        );
    };
    $timeout(function () {
        $scope.loadFolderTree();
    });

    $scope.loadFolder = function (node) {
        if (!node.leaf) {
            $scope.menu = angular.copy(folderMenu);
            $scope.menu.selectedMenu = $scope.menu.all[0];
            $scope.startSpin();
            FolderService.getOneFolder(node.id).then(
                function (data) {
                    $scope.thisFolder = data;
                    $scope.stopSpin(true, 'success');
                },
                function (err) {
                    $scope.stopSpin(false, 'load file or folder failed, please try later');
                }
            );
            //$scope.thisFolder = angular.copy(node);
        } else {
            //$scope.editFile(node);
            $scope.menu = angular.copy(fileMenu);
            $scope.menu.selectedMenu = $scope.menu.all[0];
            $scope.editFile(node);

        }

    };


    $scope.selectFolderOrFile = function () {
        $scope.thisFolder.selectedAllFolderOrFile = $scope.thisFolder.children.every(function (itm) {
            return itm.selected;
        })
    };

    $scope.selectAllFolderOrFile = function () {
        var toggleStatus = !$scope.thisFolder.selectedAllFolderOrFile;
        angular.forEach($scope.thisFolder.children, function (itm) {
            itm.selected = !toggleStatus;
        });
    };

    $scope.newFolder = {isNew: true};

    $scope.saveFolder = function (f) {
        $scope.startSpin();
        if (f.isNew) {
            f.parent_id = $scope.thisFolder.id;
            FolderService.saveFolder(f)
                .then(function (data) {
                    $scope.stopSpin(true);
                    $scope.loadFolderTree();
                    f.editing = false;
                },
                function (err) {
                    if (err.status == 409) {
                        $scope.stopSpin(false, 'save folder failed,already exists');
                    } else {
                        $scope.stopSpin(false, 'save folder failed, please try later');
                    }
                    //$scope.loadFolderTree();
                });
        } else {
            FolderService.updateFolder(f.id, f)
                .then(
                function (data) {
                    $scope.stopSpin(true, 'success');
                    $scope.loadFolderTree();
                },
                function (err) {
                    $scope.stopSpin(false, 'update folder failed, please try later');
                    //$scope.loadFolderTree();
                }
            );
        }
    };
    //$scope.
    $scope.editFileOrFolder = function (f) {
        if (!f.leaf) {
            f.editing = true;
        } else {
            $scope.editFile(f);
        }
    };

    $scope.deleteSelectedFolderOrFile = function () {
        var r = confirm("Do you want to delete the selected item?");
        if (r == true) {
            var selected = [];
            for (var i = 0; i < $scope.thisFolder.children.length; i++) {
                if ($scope.thisFolder.children[i].selected) {
                    selected.push($scope.thisFolder.children[i].id);
                }
            }
            $scope.startSpin();
            FolderService.deleteSelectFolders(selected).then(
                function (data) {
                    $scope.stopSpin(true, 'success');
                    $scope.loadFolderTree();
                },
                function (err) {
                    $scope.stopSpin(false, 'delete folder or file failed, please try later');
                    //$scope.loadFolderTree();
                }
            );
        }
    };
    // for add forms

    $scope.editFile = function (fileNode) {
        $scope.startSpin();
        if (fileNode) {
            FormService.fetchOneForm(fileNode.data_id)
                .then(function (data) {

                    $scope.editingFileNode = fileNode;
                    $scope.editingFileNode.file = data;
                    $scope.stopSpin(true, 'success');
                    $scope.thisFolder.showFileEditor = true;
                },
                function (err) {
                    $scope.stopSpin(false, 'loading file failed, please try later');
                });
        } else {
            $scope.editingFileNode = {isNew: true, file: {}, parent_id: $scope.thisFolder.id};
            $scope.thisFolder.showFileEditor = true;
        }
    };


    //$scope.forms = [{form_name: 'name1', id: '1'}, {form_name: 'name3', id: '2'}, {form_name: 'name2', id: '3'}];
    //$scope.selectForm = function () {
    //    $scope.selectedAllForms = $scope.forms.every(function (itm) {
    //        return itm.selected;
    //    })
    //};
    //
    //$scope.selectAllForms = function () {
    //    var toggleStatus = !$scope.selectedAllForms;
    //    angular.forEach($scope.forms, function (itm) {
    //        itm.selected = !toggleStatus;
    //    });
    //};
    //
    //$scope.addForms = function () {
    //    var selected = [];
    //    for (var i = 0; i < $scope.forms.length; i++) {
    //        if ($scope.forms[i].selected) {
    //            selected.push($scope.forms[i].id);
    //        }
    //    }
    //    $scope.startSpin();
    //    FolderService.addForms($scope.thisFolder.id, selected).then(
    //        function (data) {
    //            $scope.stopSpin(true);
    //            $scope.loadFolderTree();
    //        },
    //        function (err) {
    //            $scope.stopSpin(false);
    //            $scope.loadFolderTree();
    //        }
    //    );
    //}
}]);

'use strict';

app.controller('FileController', ['$scope', 'FormService', 'FolderService', 'QuestionService', '$timeout', function ($scope, FormService, FolderService, QuestionService, $timeout) {
    // options for froala text editor
    $scope.froalaOptions = {
        heightMin: 600,
        heightMax: 800,
        events: {
            'froalaEditor.focus': function (e, editor) {
                editor.selection.restore();

            },
            'froalaEditor.blur': function (e, editor) {
                editor.selection.save();
            }
        }
    };

    $scope.loadQuestionsForFile = function () {
        $scope.startSpin();
        var parentFolderId = $scope.editingFileNode.parent_id;
        FolderService.loadQuestionNodesBasedOnFolderId(parentFolderId)
            .then(
            function (data) {
                $scope.questionsForFile = data;
                $scope.stopSpin(true, 'success');
            },
            function (err) {
                $scope.stopSpin(false, 'loading questions failed, please try later');
            }
        );
    };

    var init = function () {
        $timeout(
            function () {
                $scope.froalaOptions.froalaEditor('html.set', '');
                if ($scope.editingFileNode.file.content) {
                    var i = $scope.froalaOptions.froalaEditor('html.insert', $scope.editingFileNode.file.content, true);
                }

                $scope.loadQuestionsForFile();
//                 console.log(i);
            }
        );
    };

    $scope.$watch(
        function (scope) {
            return scope.editingFileNode;
        },
        function () {
            init();
        }
    );
    //$scope.froalaOptions.froalaEditor('html.set', "");
    //$scope.froalaOptions.froalaEditor('html.insert', $scope.editingFileNode.file.content, true);

    $scope.selectedQuestionNodeForFile = {};

    $scope.selectQuestionForFile = function (questionNode) {
        angular.forEach($scope.questionsForFile, function (itm) {
            itm.selected = false;
        });
        questionNode.selected = true;
        $scope.selectedQuestionNodeForFile = questionNode;
    };
    // insert a selected node in to the file
    $scope.insertQuestionToFile = function () {
        $scope.startSpin();
        QuestionService.fetchOneQuestion($scope.selectedQuestionNodeForFile.data_id)
            .then(
            function (data) {
                var plugin = angular.element(data.content);
                if (data.options) {
                    var options = data.options;
                    //if type is select question
                    if (data.type == "select") {
                        for (var i = 0; i < options.length; i++) {
                            var opt = angular.element("<option></option>");
                            opt.text(options[i].name);
                            opt.attr('value', options[i].value);
                            plugin.find('select').append(opt);
                        }
                    }
                }

                plugin.find(".form-control").attr('disabled', 'true').attr('title', data.name).removeClass("form-control");
                plugin.attr("question_id", data.id).attr('name', data.name);
                var el = angular.element("<div></div>");
                el.append(plugin);
                var txt = "{-" + el.html() + "-}";
                $scope.froalaOptions.froalaEditor('html.insert', txt, true);
                el = null;
                $scope.stopSpin(true, 'insert question success');
            },
            function (err) {
                $scope.stopSpin(false, 'insert question failed, please try later');
            }
        );


    };

    //when save file clicked,
    //if new
    //      save file
    //      parse format
    //      update format
    //      add to folder
    //else
    //      update file
    //      parse format
    //load folder tree
    $scope.parseFileFormat = function (fileNode) {
        $scope.startSpin();
        //parse format
        var content = $scope.froalaOptions.froalaEditor('html.get', false);
        fileNode.file.content = content;
        var plugins = angular.element(content).find('plugin');
        var questions = [];
        angular.forEach(plugins, function (plugin, i) {
            var question = {id: ''};
            question.id = plugin.getAttribute('id');
            questions.push(question);
        });

        fileNode.file.questions = questions;
        // update format
        FormService.updateFormDetail(fileNode.file, fileNode.file.id).then(
            function (d) {
                $scope.stopSpin(true);
                //if new, add to folder
                if (fileNode.isNew) {
                    var selected = [];
                    selected.push(fileNode.file.id);
                    FolderService.addForms(fileNode.parent_id, selected).then(
                        function (data) {
                            $scope.stopSpin(true, 'success');
                            $scope.loadFolderTree();
                        },
                        function (err) {
                            $scope.stopSpin(false, 'create node for file failed,please try later');

                        }
                    );

                } else {//else update file node and load folder tree

                    fileNode.name = fileNode.file.form_name;
                    fileNode.description = fileNode.file.form_desc;
                    delete fileNode.file;
                    FolderService.updateFolder(fileNode.id, fileNode).
                        then(function (data) {
                            $scope.loadFolderTree();
                        }, function (err) {
                            $scope.stopSpin(false, 'update file node failed, please try later');
                        });
                }
            },
            function (e) {
                $scope.stopSpin(false, 'failed to update file format, please try later');
            }
        );
    };
    // save button clicked
    $scope.saveFile = function (fileNode) {
        $scope.startSpin();
        if (fileNode.isNew) {
            FormService.createForm(fileNode.file).then(
                function (data) {
                    fileNode.file = data;
                    $scope.parseFileFormat(fileNode);
                    $scope.stopSpin(true, 'save new file success');
                },
                function (err) {
                    $scope.stopSpin(false, 'save new file failed, please try later');
                }
            );
        } else {
            FormService.updateForm(fileNode.file, fileNode.file.id).then(
                function (data) {
                    $scope.parseFileFormat(fileNode);
                    $scope.stopSpin(true, 'update file success');
                },
                function (err) {
                    $scope.stopSpin(false, 'update file failed, please try later');
                }
            );
        }
    }

}]);

app.controller('FolderQuestionController', ['$scope', 'QuestionService', 'FolderService', function ($scope, QuestionService, FolderService) {
    var Question = function (name, type, options, description) {

    };
    $scope.types = ['textarea', "select", "text", "checkbox", "selectEmployee", "selectDepartment", "file"];
    $scope.selectQuestion = function () {
        $scope.selectedAllQuestion = $scope.questionNodeList.every(function (itm) {
            return itm.selected;
        })
    };

    $scope.selectAllQuestion = function () {
        var toggleStatus = !$scope.selectedAllQuestion;
        angular.forEach($scope.questionNodeList, function (itm) {
            itm.selected = !toggleStatus;
        });
    };


    $scope.questionNodeList = [];

    $scope.loadAllQuestionNodes = function () {
        var parentNodeId = $scope.thisFolder.id;
        $scope.startSpin();
        FolderService.loadQuestionNodesBasedOnFolderId(parentNodeId)
            .then(
            function (data) {
                $scope.questionNodeList = data;
                $scope.stopSpin(true, 'load questions success');
            },
            function (err) {
                $scope.stopSpin(false, 'load questions failed, please try later');
            }
        );
    };
    $scope.loadAllQuestionNodes();

    $scope.editQuestion = function (questionNode) {
        $scope.startSpin();
        QuestionService.fetchOneQuestion(questionNode.data_id)
            .then(
            function (data) {
                questionNode.question = data;
                $scope.stopSpin(true, 'loading ' + questionNode.name + ' success');
                questionNode.editing = true;
            },
            function (err) {
                $scope.stopSpin(false, 'loading ' + questionNode.name + ' failed, please try later');
            }
        );
    };

    // for create a new question, here the paramter is question but not questionNode
    $scope.saveQuestion = function (question) {
        $scope.startSpin();
        QuestionService.createQuestion(question)
            .then(
            function (data) {
                var selected = [];
                selected.push(data.id);
                FolderService.addQuestions($scope.thisFolder.id, selected)
                    .then(
                    function (d) {
                        $scope.loadAllQuestionNodes();
                        $scope.newQuestion.editing = false;
                        $scope.newQuestion = {};
                    }
                );
            },
            function (er) {
                $scope.stopSpin(false, 'save question ' + question.name + ' failed');
            }
        );
    };

    $scope.updateQuestion = function (questionNode) {
        $scope.startSpin();
        QuestionService.updateQuestion(questionNode.question, questionNode.question.id)
            .then(
            function (data) {
                questionNode.name = data.name;
                questionNode.description = data.description;
                FolderService.updateFolder(questionNode.id, questionNode)
                    .then(
                    function (data1) {
                        $scope.stopSpin(true, 'update question ' + questionNode.name + ' success');
                        $scope.loadAllQuestionNodes();
                    },
                    function (err) {
                        $scope.stopSpin(false, 'update question ' + questionNode.name + ' failed');
                        $scope.loadAllQuestionNodes();
                    }
                );
            },
            function (err) {
                $scope.stopSpin(false, 'update question ' + questionNode.name + ' failed');
                $scope.loadAllQuestionNodes();
            }
        );
    };

    $scope.deleteSelectedQuestion = function () {
        var r = confirm("Do you want to delete the selected item?");
        if (r == true) {
            var selected = [];
            for (var i = 0; i < $scope.questionNodeList.length; i++) {
                if ($scope.questionNodeList[i].selected) {
                    selected.push($scope.questionNodeList[i].id);
                }
            }
            $scope.startSpin();
            FolderService.deleteSelectFolders(selected).then(
                function (data) {
                    $scope.stopSpin(true, 'delete questions success');
                    $scope.loadFolderTree();
                },
                function (err) {
                    $scope.stopSpin(false, 'delete questions failed, please try later');
                    $scope.loadFolderTree();
                }
            );
        }
    };

    $scope.typeChanged = function (question) {
        var type = question.type;
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
                break;
            case 'selectEmployee':
                content = '<plugin id="{+id+}"><select class="form-control"><option>Employee</option></select></plugin>';
                break;
            case 'selectDepartment':
                content = '<plugin id="{+id+}"><select class="form-control"><option>Department</option></select></plugin>';
                break;
            case 'file':
                content = '<plugin id="{+id+}"><input type="file" class="form-control"></plugin>';
                break;
        }
        question.content = content;
    };


    $scope.newOp = {name: '', value: ''};
    $scope.addOption = function (question) {
        if (!question.options) {
            question.options = [];
        }
        question.options.push({name: $scope.newOp.name, value: $scope.newOp.value});
        $scope.newOp.name = '';
        $scope.newOp.value = '';
    };

    $scope.removeOption = function (question, i) {
        question.options.splice(i, 1);
    }

}]);

app.factory('FolderService', ['$http', '$q', function ($http, $q) {

    return {

        getFolderTree: function () {
            return $http.get('/folder/' + '0')
                .then(
                function (response) {
                    return response.data
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        },

        getOneFolder: function (id) {
            return $http.get('/folder/' + id)
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        },

        saveFolder: function (folder) {
            return $http.post('/folder/', folder)
                .then(function (response) {
                    return response.data;
                }, function (errResponse) {
                    return $q.reject(errResponse);
                });
        },

        updateFolder: function (id, folder) {
            return $http.put('/folder/' + id, folder)
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        },

        deleteSelectFolders: function (ids) {
            return $http.post('/folder/deleteFolders/', ids)
                .then(function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        },

        addForms: function (parentId, ids) {
            return $http.post('/folder/addForms/' + parentId, ids)
                .then(
                function (response) {
                    return response.data;
                },
                function (err) {
                    return $q.reject(err);
                }
            );
        },

        addQuestions: function (parentId, ids) {
            return $http.post('/folder/addQuestions/' + parentId, ids)
                .then(
                function (response) {
                    return response.data;
                },
                function (err) {
                    return $q.reject(err);
                }
            );
        },

        loadQuestionNodesBasedOnFolderId: function (parentId) {
            return $http.get('/folder/getQuestions/' + parentId)
                .then(
                function (response) {
                    return response.data;
                },
                function (err) {
                    return $q.reject(err);
                }
            );
        },

        getFolderForSelect: function () {
            return $http.get('/folder/getFolderForSelect/').then(
                function (response) {
                    return response.data;
                },
                function (err) {
                    return $q.reject(err);
                }
            );
        },

        getFlowOfFolder: function (folderId) {
            return $http.get('/folder/getFlowOfFolder/'+folderId).then(
                function (response) {
                    return response.data;
                },
                function (err) {
                    return $q.reject(err);
                }
            );
        },

    };

}]);

