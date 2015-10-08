package app.model.form;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.DiscriminatorColumn;
import javax.persistence.DiscriminatorType;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;
import org.hibernate.annotations.Proxy;

import com.fasterxml.jackson.annotation.JsonIgnore;

import app.model.form.record.FormRecord;
import engine.htmlengine.TemplatePool;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "FormType", discriminatorType = DiscriminatorType.STRING, length = 30)
@DiscriminatorValue("Form")
@Table(name = "tbl_form")
@Proxy(lazy=false)
public class Form {

	@Id
	@GeneratedValue(generator = "idGenerator")
	@GenericGenerator(name = "idGenerator", strategy = "uuid")
	@Column(name = "id", nullable = false)
	private String uuid;
	private String name;
	
	private int sequenceCode;

	@JsonIgnore
	@OneToMany(mappedBy = "form", cascade = CascadeType.ALL) // --->
	@LazyCollection(LazyCollectionOption.FALSE) // --->
	private List<FormComponent> children = new ArrayList<>();
	@Column(name="Form_TYPE")
	private FormType form_type;
	
	private String htmlPath;
	
	// belong to which module
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "module_id")
	@JsonIgnore//ignore module when create the json string
	private Module module;
	
	
	@JsonIgnore//ignore formrecords when create the json string
	@OneToMany(mappedBy="form", cascade = CascadeType.ALL)
	@LazyCollection(LazyCollectionOption.FALSE) // --->
	private List<FormRecord> formRecords = new ArrayList<>();

	private LogType logType;
	
	public void addRecord(FormRecord fr) {
		this.formRecords.add(fr);
	}

	public Form() {
	}

	public Form(String formDataXML) {

	}

	public void add(FormComponent fc) {
		this.children.add(fc);
		fc.setForm(this);
	}

	public String toHtml() {
		String result = TemplatePool.getInstance().getHtmlTemplate("Form:Form_VIEW");

		result = result.replace("###Form_Name###", this.getName());
		result = result.replace("###Form_ID###", this.getUuid());
		StringBuffer sb = new StringBuffer();
		for (FormComponent fe : children) {
			sb.append(fe.toHtml());
		}
		result = result.replace("###Form_Components###", sb.toString());
		return result;
	}
	
	public String toReport(){
		File file = new File(this.getHtmlPath());
		try {
			FileReader fr = new FileReader(file);
			BufferedReader br = new BufferedReader(fr);
			String tmp = "";
			StringBuffer sb = new StringBuffer();
			while((tmp=br.readLine())!=null){
				sb.append(tmp);
			}
			return sb.toString();
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return "";
	}
	
	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}


	public Module getModule() {
		return module;
	}

	public void setModule(Module module) {
		this.module = module;
	}

	public List<FormRecord> getFormRecords() {
		return formRecords;
	}

	public void setFormRecords(List<FormRecord> formRecords) {
		this.formRecords = formRecords;
	}

	public FormType getForm_type() {
		return form_type;
	}

	public void setForm_type(FormType form_type) {
		this.form_type = form_type;
	}

	public List<FormComponent> getChildren() {
		return children;
	}

	public void setChildren(List<FormComponent> children) {
		this.children = children;
	}
	

	public String getHtmlPath() {
		return htmlPath;
	}

	public void setHtmlPath(String htmlPath) {
		this.htmlPath = htmlPath;
	}

	public String show(){
		StringBuffer sb = new StringBuffer();
		sb.append("<ul class='draggable'><li><span class='form '><input type='hidden' name='id' value='"+this.getUuid()+"'><i class=\"glyphicon  glyphicon-user icon-edit \" onclick=\"showFormsInModule('"+this.getUuid()+"');\"> </i>");
		sb.append(getName());
		sb.append("</span> ");
		sb.append("</li></ul>");
		return sb.toString();
	}

	public enum FormType{
		CompanyForm,
		EmployeeForm,
		DepartmentForm,
		BranchQuestion;
	}
	
	public enum LogType{
		No,
		Monthly,
		Weekly,
		Daily
	}
	
//	//TODO place to service
//	public int fillPercent(String  oeid){
//		OrganizationElement oe = DAOFactoryImpl.getOrganizationElementDAO().getOEbyID(oeid);
//		if (oe == null) {
//			return 0;
//		}
//		List<FormRecord> frs = oe.getRecords();
//		boolean hasRecord = false;
//		int recordCount = 0;
//		for(FormRecord fr:frs){
//			if(fr.getForm().getUuid().equals(this.getUuid())){
//				hasRecord = true;
//				recordCount++;
//			}
//		}
//		if(hasRecord){
//			if(this.getLogType()==LogType.No){
//				return 100;
//			}else{
//				return 100;
//			}
//		}
//		
//		return 0;
//		
//	}

	public LogType getLogType() {
		return logType;
	}

	public void setLogType(LogType logType) {
		this.logType = logType;
	}

	public int getSequenceCode() {
		return sequenceCode;
	}

	public void setSequenceCode(int sequenceCode) {
		this.sequenceCode = sequenceCode;
	}
}
