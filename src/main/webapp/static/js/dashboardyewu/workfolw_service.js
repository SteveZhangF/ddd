'use strict';

app.factory('WorkFlowService', ['$http', '$q', function ($http, $q) {

    return {

        fetchAllWorkFlow: function () {
            return $http.get('/workflow/')
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

        fetchOneWorkFlow: function (id) {
            return $http.get('/workflow/'+id)
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

        createWorkFlow: function (wf) {
            return $http.post('/workflow/', wf)
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    console.error('Error while creating workflow');
                    return $q.reject(errResponse);
                }
            );
        },

        updateWorkFlow: function (wf, id) {
            return $http.put('/workflow/' + id, wf)
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    console.error('Error while updating wf');
                    return $q.reject(errResponse);
                }
            );
        },

        updateWorkFlowDetail: function (wf,id) {
            return $http.put('/workflow/detail/'+id,wf)
                .then(function (response) {
                    return response.data
                }, function (errResponse) {
                    console.error('error while updating wf detail');
                    return $q.reject(errResponse);
                }
            );
        },

        deleteWorkFlow: function (id) {
            return $http.delete('/workflow/' + id)
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    console.error('Error while deleting user');
                    return $q.reject(errResponse);
                }
            );
        },
        
        
        //workflowNode
        
        createWorkFlowNode: function (workflownode) {
            return $http.post('/workflownode/',workflownode)
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        },

        deleteWorkFlowNode: function (id) {
            return $http.delete('/workflownode/'+id).then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse)
                }
            );
        },

        updateWorkFlowNode: function (wfn,id) {
            return $http.put('/workflownode/'+id,wfn)
                .then(function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        }


    };

}]);