package app.model.userconstructure;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import app.model.form.Form.FormType;



@Entity
public class Employee extends OrganizationElement{
	
	private String sex;
	private String brithday;
	private String marriage;
	private String email;
	private String ssn;
	
	public Employee() {
		this.setFormType(FormType.EmployeeForm);
	}
	
	

	public String getSex() {
		return sex;
	}

	public void setSex(String sex) {
		this.sex = sex;
	}

	public String getBrithday() {
		return brithday;
	}

	public void setBrithday(String brithday) {
		this.brithday = brithday;
	}

	public String getMarriage() {
		return marriage;
	}

	public void setMarriage(String marriage) {
		this.marriage = marriage;
	}


	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getSsn() {
		return ssn;
	}

	public void setSsn(String ssn) {
		this.ssn = ssn;
	}


	@Override
	public String show(OrganizationElement oe) {
		// TODO Auto-generated method stub
		return null;
	}

}
