<%@page import="bean.user.User"%>
<%@page import="bean.form.module.Module"%>
<%@page import="java.util.List"%>
<%@page import="bean.user.data.Company"%>
<script
	src="<%=application.getContextPath()%>/libs/bootstrap/dist/js/bootstrap-multiselect.js">
	
</script>
<link
	href="<%=application.getContextPath()%>/libs/bootstrap/dist/css/bootstrap-multiselect.css"
	type="text/css" rel="stylesheet" />

<form id="userdetailform">

	<table cellpadding="5" cellspacing="0" border="0"
		style="padding-left: 50px;">

		<%
			User user = (User) request.getAttribute("user");
			Company company = user.getCompany();
		%>
		<input type="hidden" name="user_id" value="<%=user.getUuid()%>">
		<tr>
			<td>Email:</td>
			<td><%=user.getUser_email()%></td>
		</tr>

		<tr>
			<td>Create Time:</td>
			<td><%=user.getCreate_at()%></td>
		</tr>

		<tr>
			<td>Company Name:</td>
			<td><%=company.getName()%></td>
		</tr>

		<tr>
			<td>Modules:</td>
			<td><div class="btn-group">
					<select id="allmodule" multiple="multiple" name="modules">

						<%
							List<Module> modulesHas = (List<Module>) request.getAttribute("modulesHas");

							List<Module> modulesAll = (List<Module>) request.getAttribute("modulesAll");
							for (Module module : modulesAll) {
								if (modulesHas.contains(module)) {
									out.println("<option selected value='" + module.getId() + "'>" + module.getName() + "</option>");
								} else {
									out.println("<option value='" + module.getId() + "'>" + module.getName() + "</option>");
								}
							}
						%>
					</select>
					<button id="allmodule-toggle" class="btn btn-primary">Select
						All</button>
				</div>
			<td>
		</tr>
		<tr>
			<td>
				<button class="btn btn-primary"
					onclick="saveUser();">Save</button>
				<button class="btn btn-danger">Cancle</button>
			</td>
		</tr>
	</table>
</form>
<script src="<%=application.getContextPath()%>/custom/js/multiselect.js"></script>
<script type="text/javascript">
	function saveUser() {
		var data = $("#userdetailform").serialize();
		$.post("../user_admin",data+"&action=saveUser",function(data){
			alert(data);
		})
	}

	$(document).ready(function() {
		$('#allmodule').multiselect();
		$("#allmodule-toggle").click(function(e) {
			e.preventDefault();
			multiselect_toggle($("#allmodule"), $(this));
		});
	});
</script>