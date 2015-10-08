'use strict';
 

 /**
User Tree Service 
function create,  update , delete    
 */
app.factory('UserTreeService', ['$http', '$q','LoginService', function($http, $q,LoginService){
	var urlheader = "http://localhost:8080/ddd/usertree/";
	var company_id = LoginService.getUserInfo().companyId;
    return {
    		
            getTree : function(){
                return $http.get('http://localhost:8080/ddd/usertree/'+company_id)
                            .then(
                                    function(response){
                                        return response.data;
                                    },
                                    function(errResponse){
                                        console.error("Error whhile get Company");
                                        return $q.reject(errResponse);
                                    }
                                ); 
            },
             
            createCompany: function(company){
            	console.log(company);
                    return $http.post('http://localhost:8080/ddd/company/', company)
                            .then(
                                    function(response){
                                        return response.data;
                                    }, 
                                    function(errResponse){
                                        console.error('Error while creating company');
                                        return $q.reject(errResponse);
                                    }
                            );
            },
             
            updateCompany: function(company, id){
                    return $http.put('http://localhost:8080/ddd/company/'+id, company)
                            .then(
                                    function(response){
                                        return response.data;
                                    }, 
                                    function(errResponse){
                                        console.error('Error while updating company');
                                        return $q.reject(errResponse);
                                    }
                            );
            },
             
            deleteCompany: function(id){
                    return $http.delete('http://localhost:8080/ddd/company/'+id)
                            .then(
                                    function(response){
                                        return response.data;
                                    }, 
                                    function(errResponse){
                                        console.error('Error while deleting company');
                                        return $q.reject(errResponse);
                                    }
                            );
            }
         
    };
 
}]);