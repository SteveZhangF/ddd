<style>
.avatar-box {
	border-right: 1px solid #edeff1;
	box-shadow: inset 3px 0px 4px -1px #fafafa;
}
</style>

<%Company company =(Company) request.getAttribute("company");
	if(company == null){
		company = new Company();
	}
%>
<div class="span3 avatar-box">
	<div class="tree">
		<ul class="ancestor companyul">
		<li><span class="tree-node company " data-toggle="context">
				<i class="icon-home"></i> <%=company.getName()%></span> 
			<%
				if (company != null) {
					Set<OrganizationElement> departements = company.getDepartments();
					ShowDepartment sd = new ShowDepartment();
					for (OrganizationElement oe : departements) {
						if(!(oe instanceof Department)){
							continue;
						}
							Department dep = (Department)oe;
						if (dep.getParentDepartment() == null)
							out.println(sd.show(dep));
					}

					Set<OrganizationElement> employees = company.getEmployees();
					ShowEmployee showEmployee = new ShowEmployee();
					for (OrganizationElement dep : employees) {
						if(!(dep instanceof Employee)){
							continue;
						}
						Employee ee = (Employee)dep;
						if (ee.getDepartment() == null)
							out.println(showEmployee.show(ee));
					}
				}
			%></li>
	</ul>
	</div>
</div>
<div class="span9 form_shower"></div>

<div id="context-menu-department">
	<ul class="dropdown-menu" role="menu">
		<li><a tabindex="-1" id="add_department">Add Department</a></li>
		<li><a tabindex="-1" id="add_employee">Add Employee</a></li>
		<li><a tabindex="-1" id="edit_department">Edit</a></li>
		<li class="divider"></li>
		<li><a tabindex="-1" id="delete">Delete</a></li>
	</ul>
</div>
<div id="context-menu-company">
	<ul class="dropdown-menu" role="menu">
		<li><a tabindex="-1" id="add_department">Add Department</a></li>
		<li><a tabindex="-1" id="add_employee">Add Employee</a></li>
	</ul>
</div>

<div id="context-menu-employee">
	<ul class="dropdown-menu" role="menu">
		<li><a tabindex="-1" id="edit_employee">Edit</a></li>
		<li><a tabindex="-1" id="delete_employee">Delete</a></li>
	</ul>
</div>


<link rel="stylesheet" type="text/css"
	href="<%=application.getContextPath()%>/customer/custom/css/menu_tree.css" />
<script src="<%=application.getContextPath()%>/custom/js/menu_tree.js"></script>
<script
	src="<%=application.getContextPath()%>/customer/custom/js/bootstrap-contextmenu.js"></script>
	<script
	src="<%=application.getContextPath()%>/customer/custom/js/companytree.js"></script>
	<script type="text/javascript"
	src="<%=application.getContextPath()%>/libs/jquery-ui/jquery-ui.min.js"></script>
		<script type="text/javascript"
	src="<%=application.getContextPath()%>/libs/jquery.scrollfollow.js"></script>

