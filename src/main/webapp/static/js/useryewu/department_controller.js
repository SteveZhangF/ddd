'use strict';
 

 /**
  user department controller
  role: user
  function create, update 

 */
app.controller('UserDepartmentController', ['$scope', 'DepartmentService','LoginService', function($scope, DepartmentService,LoginService) {
          var self = this;
          self.department={uuid:null,name:'',address:'',phone:'',formType:'',company_id :'',subDepartment_id:'',department:'',employee:''};
          var userInfo;
          self.createDepartment = function(department){
              DepartmentService.createDepartment(department);
          };
 
         self.updateDepartment = function(department, uuid){
              DepartmentService.updateDepartment(department, uuid);
          };
 
        
          self.submit = function() {
              if(self.department.uuid==null){
                  console.log('Saving New Department', self.department);    
                  self.createDepartment(self.department);
              }else{
            	  console.log('Department updated with id ', self.department.uuid);
                  self.updateDepartment(self.department, self.department.uuid);
              }
              self.reset();
          };
          
          // edit or create a new department under the company
          self.edit = function(id){
            
              //get the user's information 
              userInfo = LoginService.getUserInfo();
              //if the user has a company
              if(userInfo.companyId){
            	  // get the department 
                DepartmentService.getDepartment(id).then(
                        function(d) {
                            self.department = d;
                       },
                        function(errResponse){
                            console.error('Error while fetching Currencies');
                            // if failed means id is null or no such department then set the new department's company id
                            self.department.company_id = userInfo.companyId;
                        }
               );
              }
              
          };

          self.reset = function(){
              self.edit();
              $scope.myForm.$setPristine(); //reset Form
          };
      }]);