
'use strict';

app.controller('FormFolderTreeController', ['$scope', '$filter','FolderService','FormService','usSpinnerService', function ($scope, $filter,  FolderService,FormService,usSpinnerService) {
    $scope.folders = [
        {'name':'osha',id:'0','children':[
            {'name':'blood',id:'1111','children':[],leaf:true,process:'10%'},
            {'name':'eye',id:'1111','children':[],leaf:false,process:'50%'}
        ]
            ,leaf:false
            ,
            process:'60%'}
    ];


    /**
     * spinner start
     * */

    $scope.errorMsg = {hasMsg: false, isError: false};
    $scope.spinneractive = false;
    $scope.startSpin = function () {
        if (!$scope.spinneractive) {
            usSpinnerService.spin('folder-spinner');
            $scope.spinneractive = true;
        }
    };
    $scope.stopSpin = function (flag) {
        if ($scope.spinneractive) {
            usSpinnerService.stop('folder-spinner');
            $scope.errorMsg.hasMsg = true;
            $scope.errorMsg.isError = !flag;
            $scope.spinneractive = false;
        }
    };

    $scope.$watch( 'modelTree.currentNode', function( newObj, oldObj ) {
        if( $scope.modelTree && angular.isObject($scope.modelTree.currentNode) ) {
            $scope.loadFolder($scope.modelTree.currentNode);
        }
    }, false);

    $scope.thisFolder = {};

    $scope.loadFolderTree = function () {
        $scope.startSpin();
        FolderService.getFolderTree().then(
            function (data) {
                $scope.folders = [];
                $scope.folders.push(data);
                $scope.stopSpin(true);
                if($scope.modelTree.currentNode){
                    $scope.loadFolder($scope.modelTree.currentNode);
                }else{
                    $scope.loadFolder({id:"0"});
                }
            },
            function (err) {
                $scope.stopSpin(false);
            }
        );
    };
    $scope.loadFolderTree();
    $scope.loadFolder = function (node) {
        $scope.startSpin();
        FolderService.getOneFolder(node.id).then(
            function (data) {
                $scope.thisFolder = data;
                $scope.stopSpin(true);
            },
            function (err) {
                $scope.stopSpin(false);
            }
        );
        $scope.thisFolder = angular.copy(node);
    };
    
    $scope.select = function () {
        $scope.selectedAll = $scope.thisFolder.children.every(function (itm) {
            return itm.selected;
        })
    };

    $scope.selectAll = function () {
        var toggleStatus = !$scope.selectedAll;
        angular.forEach($scope.thisFolder.children, function (itm) {
            itm.selected = !toggleStatus;
        });
    };

    $scope.newFolder = {isNew:true};

    $scope.saveFolder = function (f) {
        $scope.startSpin();
        if(f.isNew){
            f.parent_id = $scope.thisFolder.id;
            FolderService.saveFolder(f)
                .then(function (data) {
                    $scope.stopSpin(true);
                    $scope.loadFolderTree();
                    f.editing = false;
                },
                function (err) {
                    $scope.stopSpin(false);
                    $scope.loadFolderTree();
                });
        }else{
            FolderService.updateFolder(f.id,f)
                .then(
                function (data) {
                    $scope.stopSpin(true);
                    $scope.loadFolderTree();
                },
                function (err) {
                    $scope.stopSpin(false);
                    $scope.loadFolderTree();
                }
            );
        }

        console.log(f);

    };
    //$scope.
    $scope.editFileOrFolder = function (f) {
        if(!f.leaf){
            f.editing = true;
        }
    };

    $scope.deleteSelectedFolderOrFile = function () {

        var selected = [];
        for(var i=0;i<$scope.thisFolder.children.length;i++){
            if($scope.thisFolder.children[i].selected){
                selected.push($scope.thisFolder.children[i].id);
            }
        }
        $scope.startSpin();
        FolderService.deleteSelectFolders(selected).then(
            function (data) {
                $scope.stopSpin(true);
                $scope.loadFolderTree();
            },
            function (err) {
                $scope.stopSpin(false);
                $scope.loadFolderTree();
            }
        );
    };
    // for add forms
    
    $scope.showForms = function () {
        $scope.showForming = !$scope.showForming;
        $scope.startSpin();
        FormService.fetchAllForms()
            .then(function (data) {
                $scope.forms = data;
                $scope.stopSpin(true);
            },
            function (err) {
                $scope.stopSpin(false);
            });
    };
$scope.forms=[{form_name:'name1',id:'1'},{form_name:'name3',id:'2'},{form_name:'name2',id:'3'}];
    $scope.selectForm = function () {
        $scope.selectedAllForms = $scope.forms.every(function (itm) {
            return itm.selected;
        })
    };

    $scope.selectAllForms = function () {
        var toggleStatus = !$scope.selectedAllForms;
        angular.forEach($scope.forms, function (itm) {
            itm.selected = !toggleStatus;
        });
    };
    
    $scope.addForms = function () {
        var selected = [];
        for(var i=0;i<$scope.forms.length;i++){
            if($scope.forms[i].selected){
                selected.push($scope.forms[i].id);
            }
        }
        $scope.startSpin();
        FolderService.addForms($scope.thisFolder.id,selected).then(
            function (data) {
                $scope.stopSpin(true);
                $scope.loadFolderTree();
            },
            function (err) {
                $scope.stopSpin(false);
                $scope.loadFolderTree();
            }
        );
    }
}]);

app.factory('FolderService', ['$http', '$q', function ($http, $q) {

    return {

        getFolderTree: function () {
            return $http.get('/folder/'+'0')
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
            return $http.get('/folder/'+id)
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
            return $http.post('/folder/',folder)
                .then(function (response) {
                    return response.data;
                }, function (errResponse) {
                    return $q.reject(errResponse);
                });
        },

        updateFolder: function (id,folder) {
            return $http.put('/folder/'+id,folder)
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
            return $http.post('/folder/deleteFolders/',ids)
                .then(function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        },

        addForms: function (parentId,ids) {
            return $http.post('/folder/addForms/'+parentId,ids)
                .then(
                function (response) {
                    return response.data;
                },
                function (err) {
                    return $q.reject(err);
                }
            );
        }
    };

}]);