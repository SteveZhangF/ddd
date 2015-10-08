package app.model.userconstructure;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import app.model.form.Form.FormType;


@Entity
public class Department  extends OrganizationElement{

	public Department() {
		this.setFormType(FormType.DepartmentForm);
	}

	@Override
	public String show(OrganizationElement oe) {
		return "";
	}
	
	
}
