package app.model.userconstructure;

public class ShowEmployee extends OrganizationElement {

	@Override
	public String show(OrganizationElement oe) {
		StringBuffer sb = new StringBuffer();
		Employee e = (Employee) oe;
		sb.append("<ul><li><span class='employee'><input type='hidden' name='id' value='"+e.getUuid()+"'><i class=\"icon-user\"></i>");
		sb.append(e.getName().replace(":",""));
		sb.append("</span> ");
		sb.append("</li></ul>");
		return sb.toString();
	}
}
