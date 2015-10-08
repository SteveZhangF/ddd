$(document).ready(function() {
	submitForm("../company", {
		action : "edit"
	}, function(data) {
		$(".form_shower").html(data);
	});
	var spans_department = $(".tree").find(".department");
	$.each(spans_department, function(i, se) {
		$(se).contextmenu({
			target : '#context-menu-department',
			onItem : function(context, e) {
				var id = $(e.target).attr('id');
				switch (id) {
				case "add_department":
					addDepartment($(context.find("input")).attr("value"), 0);
					break;
				case "edit_department":
					addDepartment('0', $(context.find("input")).attr("value"));
					break;
				case "delete":
					
					deleteDepartment($(context.find("input")).attr("value"));
					break;
				case "add_employee":
					addEmployee($(context.find("input")).attr("value"), '0');
					break;
				}

			}
		});
	});
	var spans_company = $(".tree").find(".company");
	$.each(spans_company, function(i, se) {
		$(se).contextmenu({
			target : '#context-menu-company',
			onItem : function(context, e) {
				var id = $(e.target).attr('id');
				switch (id) {
				case "add_department":
					addDepartment($(context.find("input")).attr("value"), 0);
					break;
				case "add_employee":
					addEmployee($(context.find("input")).attr("value"), '0');
					break;
				}

			}
		});
	});

	var spans_employee = $(".tree").find(".employee");
	$.each(spans_employee, function(i, se) {
		$(se).contextmenu({
			target : '#context-menu-employee',
			onItem : function(context, e) {
				var id = $(e.target).attr('id');
				switch (id) {
				case "edit_employee":
					addEmployee(0, $(context.find("input")).attr("value"));
					break;
				case "delete_employee":
					deleteEmployee($(context.find("input")).attr("value"));
					break;
				}

			}
		});
	});
});

/**
 * add or edit the department
 * 
 * @param parentid:
 *            the parent department id(set it to '-1' if add the department to
 *            the company)
 * @param myid :
 *            the id of edited department(set it to '-1' if create a new one)
 */
function addDepartment(parentid, myid) {
	submitForm("../department", {
		action : "edit",
		superDepartmentID : parentid,
		department_id : myid
	}, function(data) {
		$(".form_shower").html(data);
	});
}
/**
 * delete the department
 * 
 * @param id :
 *            the department id
 */
function deleteDepartment(id) {
	submitForm("../department", {
		action : "delete",
		department_id : id
	}, function(data) {
		$("#company_leftmenu").click();
	});
}
/**
 * add or edit the employee
 * 
 * @param departmentID:
 *            add the employee to which department (set it to '-1' if add the
 *            employee to the company)
 * @param myid:
 *            the employee id (set it to '-1' if create a new employee)
 * 
 * the form will be shown in the right frame (<div "#main_container"> in
 * application.jsp)
 */
function addEmployee(departmentID, myid) {
	submitForm("../employee", {
		action : "edit",
		department_id : departmentID,
		employee_id : myid
	}, function(data) {
		$(".form_shower").html(data);
	});
}
function deleteEmployee(id) {
	submitForm("../employee", {
		action : "delete",
		employee_id : id
	}, function(data) {
		$("#company_leftmenu").click();
	});
}

function subOrganazation() {
	console.log("save");
	var action = $("#contactForm").attr("action");
	submitForm(action, $("#contactForm").serialize(), function(data) {
		alert(data);
		$("#company_leftmenu").click();
	});
}

function showforms(oe_id, target) {
	if (oe_id == null || oe_id == 'null') {
		alert("please save first!");
	} else {
		$.ajax({
			cache : true,
			type : "POST",
			url : "../userform",
			data : {
				action : 'getFormshower',
				oe_id : oe_id
			},
			async : false,
			error : function(request) {

			},
			success : function(data) {
				$(target).html(data);
			}
		});
	}
}
function viewForm(vformid, voe_id) {
	submitForm("../userform", {
		action : "viewform",
		form_id : vformid,
		oe_id : voe_id
	}, function(data) {
		$("#form_content").html(data.form);
		$("#preview_container_body").html(data.report);
		parseRecord(data.records);
		parsePreview(data.records);
	});
}

function parsePreview(recordjson) {

	var recordjson = recordjson[0];
	var recordid = recordjson.id;
	var frclist = recordjson.frcList;
	$.each(frclist, function(i, frc) {
		var fcid = frc.fComponent.uuid;
		var value = frc.value;
		$component = $("#preview_container_body").find("#"+fcid);
		$u=$("<u></u>");
		$u.append(value);
		$component.replaceWith($u);
	});

	$("#bt_preview").click(function() {
		$("#preview_container").modal("show");
	});
}

/**
 * parse the record and fill them to the form
 * 
 * @param recordjson:
 *            one record in json format
 */
function parseRecord(recordjson) {
	console.log(recordjson);
	if (recordjson.length > 0) {
		var recordjson = recordjson[0];
		$("#form_container").find("form").append(
				"<input type='hidden' name='record_id' value='" + recordjson.id
						+ "'>");
		var recordid = recordjson.id;
		var frclist = recordjson.frcList;
		$.each(frclist, function(i, frc) {
			var fcid = frc.fComponent.uuid;
			var value = frc.value;
			$component = $("#" + fcid);
			$component.val(value);
		});
	}
}

/**
 * @param id:OE
 *            id (Company employee department id)
 */
function submitCustomizedForm() {
	var id = $("#onload_oe_id").attr("value");
	submitForm("../userform?action=submitform&id=" + id, $("#form_content")
			.find("form").serialize(), function(data) {
		alert("success!")
	});
}