package app.model.userconstructure;

public class ShowDepartment extends OrganizationElement {
	// <ul>
	// <li><span><i class="glyphicon glyphicon-plus-sign"></i>
	// <%=dep.getDepartment_name() %></span> <a href="">Goes somewhere</a>
	// <%Set<Department> subDepartment = dep.getSubDepartment();
	// for(Department subD: subDepartment){
	// %>
	// <ul>
	// <li><span><i class="glyphicon glyphicon-user"></i>
	// Grand Child</span> <a href="">Goes somewhere</a></li>
	// </ul> <%
	// }
	//
	// %></li>
	// </ul> <%
	@Override
	public String show(OrganizationElement oe) {
		Department department = (Department) oe;
		StringBuffer sb = new StringBuffer();
		sb.append("<ul><li><span class=\"department\"><input type='hidden' name='department_id' value='"+department.getUuid()+"'><i class=\"icon-sitemap\"></i>");
		sb.append(department.getName());
		sb.append("</span>");
//		for (Department subd : department.getSubDepartment()) {
//			sb.append(this.show(subd));
//			System.out.println(this.show(subd));
//		}
//		for (Employee e : department.getEmployees()) {
//			sb.append(new ShowEmployee().show(e));
//		}
		sb.append("</li></ul>");
		return sb.toString();
	}

}
