<%@page import="bean.form.module.Module"%>
<%@page import="bean.user.data.OrganizationElement"%>
<%@page import="bean.user.data.ShowEmployee"%>
<%@page import="bean.user.data.Employee"%>
<%@page import="bean.user.data.ShowDepartment"%>
<%@page import="java.util.Set"%>
<%@page import="java.util.List"%>
<%@page import="bean.user.data.Department"%>
<%@page import="bean.user.data.Company"%>

<%
	List<Module> modules = (List) request.getAttribute("modules");
%>
<style>
.avatar-box {
	border-right: 1px solid #edeff1;
	box-shadow: inset 3px 0px 4px -1px #fafafa;
}
</style>
<div class="span3 avatar-box">
	<div class="tree">
		<%
			for (Module module : modules) {
				out.println(module.show());
			}
		%>
	</div>
</div>
<div class="span9 form_shower"></div>

	<link rel="stylesheet" type="text/css"
		href="<%=application.getContextPath()%>/customer/custom/css/menu_tree.css" />
	<script src="<%=application.getContextPath()%>/custom/js/menu_tree.js"></script>

	<script
		src="<%=application.getContextPath()%>/customer/custom/js/percent.js"></script>
	<script
		src="<%=application.getContextPath()%>/customer/custom/js/module.js"></script>

	<script>
		$(document).ready(function() {
			showModulePercent();
		});
	</script>