package app.model.userconstructure;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.*;

import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import com.fasterxml.jackson.annotation.JsonIgnore;

import app.model.form.Form.FormType;
import app.model.user.User;
import app.model.form.Module;


@Entity
public class Company extends OrganizationElement {

	public Company() {
		this.setFormType(FormType.CompanyForm);
	}

	private int user_id;

	@ManyToMany // ---> ManyToMany指定多对多的关联关系
	@JoinTable(name = "tbl_company_module", joinColumns = { @JoinColumn(name = "company_id") }, inverseJoinColumns = {
			@JoinColumn(name = "module_id") }) // --->
												// 因为多对多之间会通过一张中间表来维护两表直接的关系，所以通过
												// JoinTable
												// 这个注解来声明，name就是指定了中间表的名字，JoinColumns是一个
												// @JoinColumn类型的数组，表示的是我这方在对方中的外键名称，我方是Course，所以在对方外键的名称就是
												// rid，inverseJoinColumns也是一个
												// @JoinColumn类型的数组，表示的是对方在我这放中的外键名称，对方是Teacher，所以在我方外键的名称就是
												// tid
	@JsonIgnore
	@LazyCollection(LazyCollectionOption.EXTRA)
	private List<Module> modules = new ArrayList<Module>();

	public void addModule(Module m) {
		if (!this.getModules().contains(m)) {
			this.modules.add(m);
			m.addCompany(this);
		}
	}


	public List<Module> getModules() {
		return modules;
	}

	public void setModules(List<Module> modules) {
		this.modules = modules;
	}

	@Override
	public String show(OrganizationElement oe) {
		// TODO Auto-generated method stub
		return null;
	}


	public int getUser_id() {
		return user_id;
	}

	public void setUser_id(int user_id) {
		this.user_id = user_id;
	}

	@Override
	public String getCompany_id() {
		return this.getUuid();
	}

	@Override
	public boolean equals(Object obj) {
		// TODO Auto-generated method stub
		if(obj==null || !(obj instanceof Company))
			return false;
		Company other = (Company)obj;
		if(other.getUuid().equals(this.getUuid()))
			return true;
		return false;
	}
}
