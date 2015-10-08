package app.model.userconstructure;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import com.fasterxml.jackson.annotation.JsonIgnore;

import app.model.form.Form.FormType;
import app.model.form.record.FormRecord;

@Entity
@Inheritance(strategy=InheritanceType.TABLE_PER_CLASS) 
@Table(name="organizationelement")
public abstract class OrganizationElement {
	@JsonIgnore
	@OneToMany(mappedBy="oe")
	@LazyCollection(LazyCollectionOption.EXTRA)
	private List<FormRecord> records = new ArrayList<FormRecord>();
	
	@Id
	@GeneratedValue(generator = "idGenerator")
	@GenericGenerator(name = "idGenerator", strategy = "uuid")
	@Column(name = "id", nullable = false)
	private String uuid;
	private String address;
	private String phone;
	private String name;
	private FormType formType;
	
	protected String company_id;
	
	@ManyToOne
	@JoinColumn(name="parent_id")
	@JsonIgnore
	private OrganizationElement parent;
	
	@OneToMany(mappedBy = "parent") // --->
	@Cascade({ CascadeType.ALL})
	@LazyCollection(LazyCollectionOption.FALSE) // --->
	private List<OrganizationElement> children;
	
	public List<OrganizationElement> getChildren() {
		return children;
	}


	public void setChildren(List<OrganizationElement> children) {
		this.children = children;
	}
	
	
	public String getCompany_id() {
		return company_id;
	}



	public void setCompany_id(String company_id) {
		this.company_id = company_id;
	}



	public void addRecord(FormRecord fr){
		this.records.add(fr);
	}

	

	public List<FormRecord> getRecords() {
		return records;
	}

	public void setRecords(List<FormRecord> records) {
		this.records = records;
	}
	
	public abstract String show(OrganizationElement oe);


	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}



	public FormType getFormType() {
		return formType;
	}



	public void setFormType(FormType formType) {
		this.formType = formType;
	}
	
//	public LinkedList<Form> getMyForms(){
//		LinkedList<Form> forms = new LinkedList<>();
//		for(Module module: this.getCompany().getModules()){
//			for(Form f:module.getFormbyType(this.getFormType())){
//				forms.add(f);
//			}
//		}
//		return forms;
//	}
	
	 
    @Override
    public String toString() {
        return "Company [uuid=" + uuid + ", name=" + name + ", address=" + address
                + ", phone=" + phone + "]";
    }


	public OrganizationElement getParent() {
		return parent;
	}


	public void setParent(OrganizationElement parent) {
		this.parent = parent;
	}
}
