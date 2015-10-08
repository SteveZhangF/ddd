'use strict';

var app = angular.module('clientApp', [ 'ngRoute' ]);

app.run([
		"$rootScope",
		"$location",
		function($rootScope, $location) {
			$rootScope.$on("$routeChangeSuccess", function(userInfo) {
				console.log(userInfo);
			});

			$rootScope.$on("$routeChangeError", function(event, current,
					previous, eventObj) {
				if (eventObj.authenticated === false) {
					$location.path("/login");
				}
			});
		} ]);
app.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when("/", {
		templateUrl : "/ddd/static/app/templates/user.html",
		controller : "userController",
		resolve : {
			auth : [ "$q", "LoginService", function($q, LoginService) {
				var userInfo = LoginService.getUserInfo();

				if (userInfo) {
					return $q.when(userInfo);
				} else {
					return $q.reject({
						authenticated : false
					});
				}
			} ]
		}
	}).when("/login", {
		templateUrl : "/ddd/static/app/templates/login.html",
		controller : "loginController"
	});
} ]);

app.controller('loginController', [ '$scope', 'LoginService',
		function($scope, LoginService) {
			 $scope.ssoId="";
			$scope.password="";
			$scope.login = function() {
				console.log($scope.ssoId);
				LoginService.login($scope.ssoId, $scope.password);
			}
		} ]);

app.controller('userController', [ '$scope', function($scope) {
	var users = [ 'tom', 'lewis', 'alisa', 'joe' ];
	$scope.users = users;
} ]);
app.controller('userNameController', [ '$scope', '$routeParams',
		'LoginService', function($scope, $routeParams, LoginService) {
			$scope.hello = function(name) {
				// alert('Hello ' + (name || 'world') + '!');
				LoginService.login('123', 'ddd');
				// LoginService.label();
			}
			var name = $routeParams.name;
			var users = [ {
				name : 'tom',
				tel : 13333333333,
				age : 18,
				sex : 'man'
			}, {
				name : 'lewis',
				tel : 17777777777,
				age : 29,
				sex : 'woman'
			}, {
				name : 'alisa',
				tel : 15555555555,
				age : 25,
				sex : 'man'
			}, {
				name : 'joe',
				tel : 18888888888,
				age : 22,
				sex : 'woman'
			} ];
			var userDetail;
			users.forEach(function(item, i, context) {
				if (item.name == name) {
					userDetail = item;
					return;
				}
			});
			$scope.user = userDetail;
		} ]);
app.filter('checkmark', function() {
	return function(input) {
		return input ? '\u2713' : '\u2718';
	};
});

app.service('Book', [ '$rootScope', function($rootScope) {
	var service = {
		books : [ {
			title : "Magician",
			author : "Raymond E. Feist"
		}, {
			title : "The Hobbit",
			author : "J.R.R Tolkien"
		} ],

		addBook : function(book) {
			service.books.push(book);
			$rootScope.$broadcast('books.update');
		}
	}
	return service;
} ]);
