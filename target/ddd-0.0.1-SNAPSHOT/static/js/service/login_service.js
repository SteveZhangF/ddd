'use strict';

app.service('LoginService', [ '$http', '$q', '$window', function($http, $q, $window) {
	var userInfo;
	
	function getUserInfo() {
	    return userInfo;
	  }
	
	function login(ssoId, password) {
		var deferred = $q.defer();
		$http.post("http://localhost:8080/ddd/login", {
			ssoId : ssoId,
			password : password
		}).then(function(result) {
			userInfo = {
				accessToken : result.data.access_token,
				userName : result.data.userName,
				userId:result.data.userId,
				companyId:result.data.companyId
			};
			$window.sessionStorage["userInfo"] = JSON.stringify(userInfo);
			deferred.resolve(userInfo);
		}, function(error) {
			deferred.reject(error);
		});

		return deferred.promise;
	}

	function logout() {
		var deferred = $q.defer();

		$http({
			method : "POST",
			url : logoutUrl,
			headers : {
				"access_token" : userInfo.accessToken
			}
		}).then(function(result) {
			$window.sessionStorage["userInfo"] = null;
			userInfo = null;
			deferred.resolve(result);
		}, function(error) {
			deferred.reject(error);
		});

		return deferred.promise;
	}
	function init() {
	      if ($window.sessionStorage["userInfo"]) {
	        userInfo = JSON.parse($window.sessionStorage["userInfo"]);
	      }
	    }
	init();
	return {
		login : login,
		logout : logout,
		getUserInfo:getUserInfo
	};
} ]);
