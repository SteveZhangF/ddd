'use strict';
(function() {
	var app = angular.module('clientApp');
	app
			.controller(
					'UserOgnzTreeController',
					[
							'$scope',
							'$timeout',
							'CompanyService','LoginService',
							function($scope,$timeout, CompanyService,LoginService) {
								var company_tree, tree;
								$scope.org_selected = function(branch) {
									$scope.organzation = branch;
									return branch;
								};
								
								$scope.treereFresh = false;
								$scope.refreshTree = function(){
									$scope.treereFresh = true;
									$timeout(function(){$scope.treereFresh = false;
									getData();
									},500);
									
								}
								// get the json data of the all tree from server
								// by companyservice
								// and convert the data to the tree format
								// 
								var company_id = LoginService.getUserInfo().companyId;
								console.log(company_id);
								var getData = function() {
									// to show the loading label
									$scope.doing_async = true;
									
									CompanyService
											.getCompany(company_id)
											.then(
													function(d) {
// {"uuid":"1","address":"ddd","phone":"1111sddddd","name":"asw","formType":"CompanyForm","company_id":"1","children":[],"user_id":1}
														var convert = function(json){
															var treenode = {};
															treenode.label = json.name;
															treenode.type = json.formType;
															treenode.uuid = json.uuid;
															treenode.classes = [];
															treenode.children = [];
															treenode.contextmenu = "companyMenu";
															var i;
															for(i=0;i<json.children.length;i++){
																treenode.children[i] = convert(json.children[i]);
															}
															return treenode;
														}
														company_tree = [];
														company_tree[0] = convert(d);
														console.log(company_tree);
														$scope.my_data = company_tree;
														$scope.org_selected(company_tree[0]);
														$scope.doing_async = false;
													},
													function(errResponse) {
														company_tree = [];
														company_tree[0] = {label:"company not init, click to init company",type:"CompanyForm"};
														$scope.my_data = company_tree;
														$scope.org_selected(company_tree[0]);
														$scope.doing_async = false;
													});
								}
								// init data from server
								getData();
								$scope.my_tree = tree = {};
								$scope.my_data = [];
							} ]);
}());
