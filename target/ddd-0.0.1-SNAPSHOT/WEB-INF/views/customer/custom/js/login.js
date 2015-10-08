
var passwordwrong = "2";
var nouserfound = "1";
var loginsuccess = "0";
// 提交登录表单并登录
function submitForm(vurl, vdata,callback) {
	$.ajax({
		cache : true,
		type : "POST",
		url : vurl,
		data : vdata,
		async : false,
		error : function(request) {
			
		},
		success : function(data) {
			callback(data);
		}
	});
}
function login(form) {
	var vdata = $(form).serialize() + "&action=login";
	submitForm("../user", vdata, function(data) {
		switch (data) {
		case loginsuccess:
			$('#login-modal').modal('hide');
			location.reload();
			break;
		case nouserfound:
			$(modal_container).find("#login_alert").removeClass("hidden").removeClass("alert-success").addClass("alert-danger");
			$(modal_container).find("#login_alert").html("No such user!");			
			break;
		case passwordwrong:
			$(modal_container).find("#login_alert").removeClass("hidden").removeClass("alert-success").addClass("alert-danger");
			$(modal_container).find("#login_alert").html("Password wrong!");
			break;
		}
	});
}
function bindCheckEmail() {
	var emails = $("[name='email']");
	$.each(emails, function(i, e) {
		$(e).bind('input propertychange', function() {
			checkEmail($(e));
		});
		$(e).popover({
			content:"buduideemaildizhi"
		});
	});
}
window.onload = function() {
	bindCheckEmail();
}
//jQuery(function($) {bindCheckEmail(); })(jQuery);
// check email address and pwd length
function checkEmail(email) {
	var search_str = /^[\w\-\.]+@[\w\-\.]+(\.\w+)+$/;
	var email_val = $(email).val();
	$(email).popover("hide");
	if (!search_str.test(email_val)) {
		$(email).popover("show");
	} else {
		$(email).popover("hide");
	}
}

// log out
function logout() {
	vdata = {
		"action" : "logout"
	};
	submitForm("../user", vdata, function(data) {
		window.location.href = 'index.jsp';
	});
}
// 提交注册表单
function register(form) {

	var vdata = $(form).serialize() + "&action=register";
	submitForm("../user", vdata, function(data) {
		switch (data) {
		case loginsuccess:
			$(modal_container).find("#login_alert").removeClass("hidden");
			$(modal_container).find(".login").removeClass("hidden");
			$(modal_container).find(".register").addClass("hidden");
			break;
		case nouserfound:
			alert("No user name found!");
			break;
		case passwordwrong:
			alert("password wrong!");
			break;
		}
	});
}
// 显示注册表单
function showRegister(modal_container) {
	$(modal_container).find(".register").removeClass("hidden");
	$(modal_container).find(".login").addClass("hidden");
}