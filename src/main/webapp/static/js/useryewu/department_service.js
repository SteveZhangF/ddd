'use strict';
 

 /**
Department Service 
function create, fetchall, update , delete    

 */
app.factory('DepartmentService', ['$http', '$q', function($http, $q){
 
    return {
         
            fetchAllDepartment: function() {
                    return $http.get('http://localhost:8080/ddd/department/')
                            .then(
                                    function(response){
                                        return response.data;
                                    }, 
                                    function(errResponse){
                                        console.error('Error while fetching department');
                                        return $q.reject(errResponse);
                                    }
                            );
            },

            getDepartment : function(id){
                return $http.get('http://localhost:8080/ddd/department/'+id)
                            .then(
                                    function(response){
                                        return response.data;
                                    },
                                    function(errResponse){
                                        console.error("Error whhile get Department");
                                        return $q.reject(errResponse);
                                    }
                                ); 
            },
             
            createDepartment: function(department){
            	console.log(department);
                    return $http.post('http://localhost:8080/ddd/department/', department)
                            .then(
                                    function(response){
                                        return response.data;
                                    }, 
                                    function(errResponse){
                                        console.error('Error while creating department');
                                        return $q.reject(errResponse);
                                    }
                            );
            },
             
            updateDepartment: function(department, id){
                    return $http.put('http://localhost:8080/ddd/department/'+id, department)
                            .then(
                                    function(response){
                                        return response.data;
                                    }, 
                                    function(errResponse){
                                        console.error('Error while updating department');
                                        return $q.reject(errResponse);
                                    }
                            );
            },
             
            deleteDepartment: function(id){
                    return $http.delete('http://localhost:8080/ddd/department/'+id)
                            .then(
                                    function(response){
                                        return response.data;
                                    }, 
                                    function(errResponse){
                                        console.error('Error while deleting department');
                                        return $q.reject(errResponse);
                                    }
                            );
            }
         
    };
 
}]);