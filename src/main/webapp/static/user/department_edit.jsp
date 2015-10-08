<jsp:useBean id="department" scope="request"
	class="bean.user.data.Department" />
<link href="<%=application.getContextPath() %>/customer/css/form-editor.css" rel="stylesheet" />
<div class="span7 form-editor">
	<ul class="nav nav-tabs" role="tablist">
		<li role="presentation" class="active"><a
			href="#basic_information" aria-controls="basic_information"
			role="tab" data-toggle="tab">Basic Information</a></li>
		<li role="presentation"><a href="#forms" data-toggle="tab"
			onclick="showEmployeeFormSelector('<%=department.getUuid()%>')">Forms</a></li>
	</ul>
	<div class="tab-content">

		<div role="tabpanel" class="tab-pane fade in active form_tab "
			id="basic_information">
			<h5>Department info</h5>
			<form id="contactForm" class="form-horizontal"
				action="<%=application.getContextPath()%>/department">
				<input type="hidden" name="action" value="save" /> <input
					type="hidden" name="superDepartmentID"
					value="<%=request.getParameter("superDepartmentID")%>" />
				<input type="hidden" name="department_id"
					value='<jsp:getProperty property="uuid" name="department"/>' />

				<div class="field-box">
					<label>Department Name:</label> <input class="span5 inline-input"
						type="text" name="department_name"
						value="<%=department != null ? department.getName() : ""%>" />
				</div>

				<div class="field-box">
					<label>Address:</label> <input class="span5 inline-input"
						type="text" name="department_address"
						value="<%=department != null ? department.getAddress() : ""%>" />
				</div>
				<div class="field-box">
					<label>Phone Number:</label> <input class="span5 inline-input"
						type="text" name="department_phone"
						value="<%=department != null ? department.getPhone() : ""%>" />
				</div>

			</form>
			<div id="form_submit_button_group" class="center">
				<button id="bt_submit"
					onclick="subOrganazation();"
					class="btn btn-primary">Save</button>
				<button id="bt_cancel" onclick="" class="btn btn-primary">Cancel</button>
			</div>
		</div>
		
		
		<div role="tabpanel" class="tab-pane fade form_tab" id="forms">
			<div class="form_selector row" id="employee_form_selector"></div>
			<hr>
			<div id="form_container"></div>
			<div class="modal" id="preview_container">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal"
								aria-label="Close"></button>
							<h4 class="modal-title">Preview</h4>
						</div>
						<div class="modal-body"></div>
						<div class="modal-footer">
							<button type="button" class="btn btn-default"
								data-dismiss="modal">Close</button>
							<button type="button" class="btn btn-primary">Print</button>
						</div>
					</div>
					<!-- /.modal-content -->
				</div>
			</div>

			<div id="form_submit_button_group" class="center">
				<button id="bt_submit"
					onclick="submitCustomizedForm('<%=department.getUuid()%>');"
					class="btn btn-primary">Save</button>
				<button id="bt_preview" onclick="">Preview</button>
				<button id="bt_cancel" onclick="" class="btn btn-primary">Cancel</button>
			</div>
		</div>
	</div>
</div>









