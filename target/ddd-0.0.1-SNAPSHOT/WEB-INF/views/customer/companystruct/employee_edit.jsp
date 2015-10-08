<jsp:useBean id="employee" scope="request"
	class="bean.user.data.Employee" />

<link
	href="<%=application.getContextPath() %>/customer/css/form-editor.css"
	rel="stylesheet" />
<div class=" form-editor">
	<ul class="nav nav-tabs" role="tablist">
		<li role="presentation" class="active"><a
			href="#basic_information" aria-controls="basic_information"
			role="tab" data-toggle="tab">Basic Information</a></li>
		<li role="presentation"><a href="#forms" data-toggle="tab"
			onclick="showforms('<%=employee.getUuid()%>','#forms')">Forms</a></li>
	</ul>
	<div class="tab-content">
		<div role="tabpanel" class="tab-pane fade in active  "
			id="basic_information">
			<h5>employee info</h5>
			<form id="contactForm" class="form-horizontal"
				action="<%=application.getContextPath()%>/employee">

				<input type="hidden" name="action" value="save" /> <input
					type="hidden" name="employee_id"
					value='<jsp:getProperty property="uuid" name="employee"/>' />
					
				<input type="hidden" name="department_id" value="<%=request.getParameter("department_id")%>"/>

				<div class="field-box">
					<label>First Name:</label> <input type="text" class="span5 inline-input"
						name="firstName" placeholder="First name"
						value="<%String fullname = employee.getName();
			if (fullname != null && fullname.contains(":")) {
				out.println(fullname.split(":")[0]);
			}%>" />
				</div>
				
				<div class="field-box">
					<label>Last Name:</label> 
					<input type="text" class="span5 inline-input" name="lastName"
						placeholder="Last name"
						value="<%if (fullname != null && fullname.contains(":"))
				out.println(fullname.split(":")[1]);%>" />
				</div>
				

				<div class="field-box">
					<label>Phone:</label> <input type="text" class="span5 inline-input"
						name="phoneNumber" value="<%=employee.getPhone()%>" />

				</div>


				<div class="field-box">
					<label>Email:</label> <input type="text" class="span5 inline-input"
						name="email" value="<%=employee.getEmail()%>" />
				</div>
				

			</form>
			<div id="form_submit_button_group" class="span2">
				<button id="bt_submit" onclick="subOrganazation();"
					class="btn btn-primary">Save</button>
				<button id="bt_cancel" onclick="" class="btn btn-primary">Cancel</button>
			</div>
		</div>

		<div role="tabpanel" class="tab-pane fade " id="forms">
		</div>
	</div>
</div>









