package app.model.form;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import com.fasterxml.jackson.annotation.JsonFilter;
import com.fasterxml.jackson.annotation.JsonIgnore;

import app.model.form.Form.FormType;
import app.model.userconstructure.Company;


@Entity
@Table(name = "tbl_Module")
public class Module{
	@Id
	@GeneratedValue(generator = "idGenerator")
	@GenericGenerator(name = "idGenerator", strategy = "uuid")
	@Column(name = "id", nullable = false)
	private String id;
	private String name;
	
	
	private String workFlowID;
	
	@JsonIgnore
	@OneToMany(mappedBy = "module", cascade = CascadeType.ALL) 
	@LazyCollection(LazyCollectionOption.FALSE) // --->
	private List<Form> forms = new ArrayList<Form>();

	// 子模块
	@JsonIgnore
	@OneToMany(mappedBy="superModule",fetch = FetchType.EAGER)
	@LazyCollection(LazyCollectionOption.FALSE)
	private List<Module> subModules = new ArrayList<Module>();
	// 父模块
	@JsonIgnore
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "parent_module_id")
	private Module superModule;

	// 该模块属于哪个公司 由company来维护关系 
	@JsonIgnore//ignore Company when create the json string
	@ManyToMany(mappedBy="modules")
	@LazyCollection(LazyCollectionOption.FALSE)
	private List<Company> companies = new ArrayList<Company>();

	public void addCompany(Company c){
		if (!this.getCompanies().contains(c)) {
			this.companies.add(c);
		}
	}
	
	public List<Form> getFormbyType(FormType formType){
		List<Form> result = new ArrayList<Form>();
		for(Form form : this.getForms()){
			System.out.println(form.getForm_type()+"====>"+formType);
			if(form.getForm_type() == formType){
				result.add(form);
			}
		}
		for(Module subModule:this.getSubModules()){
			result.addAll(subModule.getFormbyType(formType));
		}
		return result;
	}
	
	public void addForm(Form form) {
		this.forms.add(form);
		form.setModule(this);
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<Form> getForms() {
		return forms;
	}

	public void setForms(List<Form> forms) {
		this.forms = forms;
	}

	public List<Module> getSubModules() {
		return subModules;
	}

	public void setSubModules(List<Module> subModules) {
		this.subModules = subModules;
	}

	public Module getSuperModule() {
		return superModule;
	}

	public void setSuperModule(Module superModule) {
		this.superModule = superModule;
	}

	public List<Company> getCompanies() {
		return companies;
	}

	public void setCompanies(List<Company> companies) {
		this.companies = companies;
	}
	
	public String show(){
		StringBuffer sb = new StringBuffer();
		sb.append("<ul class='ancestor draggable'><li class='droppable'><span class=\"module \"><input type='hidden' name='module_id' value='"+this.getId()+"'><i class=\"icon-folder-close-alt glyphicon  glyphicon-plus-sign\"> </i>");
		sb.append(this.getName());
		sb.append("</span>");
		for (Module subd :this.getSubModules()) {
			sb.append(subd.show());
		}
		for (Form form: this.getForms()) {
			sb.append(form.show());
		}
		sb.append("</li></ul>");
		return sb.toString();
	}

	@Override
	public boolean equals(Object obj) {
		// TODO Auto-generated method stub
		if(obj == null || ! (obj instanceof Module))
			return false;
		Module other = (Module)obj;
		if(this.getId().equals(other.getId()))
			return true;
		return false;
	}

	public String getWorkFlowID() {
		return workFlowID;
	}

	public void setWorkFlowID(String workFlowID) {
		this.workFlowID = workFlowID;
	}

}
