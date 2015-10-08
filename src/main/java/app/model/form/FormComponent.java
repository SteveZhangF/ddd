package app.model.form;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Proxy;

import com.fasterxml.jackson.annotation.JsonIgnore;

import engine.htmlengine.TemplatePool;

@Entity
@Table(name = "tbl_form_component")
public class FormComponent {
	@Id
	@GeneratedValue(generator = "idGenerator")
	@GenericGenerator(name = "idGenerator", strategy = "uuid")
	private String uuid;
	private String component_name;
	private String component_type;
	private String component_content;// for option <option value="">ss</option
	private int sequence_code;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "form_id")
	private Form form;

	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getComponent_name() {
		return component_name;
	}

	public void setComponent_name(String component_name) {
		this.component_name = component_name;
	}

	public String getComponent_type() {
		return component_type;
	}

	public void setComponent_type(String component_type) {
		this.component_type = component_type;
	}


	public String toHtml() {
		String result = TemplatePool.getInstance()
				.getHtmlTemplate("FormComponent:" + this.getComponent_type().toUpperCase() + "ComponentVIEW");
		result = result.replace("###Form_Component_Name###", this.getComponent_name());
		result = result.replace("###Form_Component_ID###", this.getUuid());
		result = result.replace("###Form_Component_Content###", this.getComponent_content());
		return result;
	}

	public String getComponent_content() {
		return component_content;
	}

	public void setComponent_content(String component_content) {
		this.component_content = component_content;
	}

	public Form getForm() {
		return form;
	}

	public void setForm(Form form) {
		this.form = form;
	}

	public int getSequence_code() {
		return sequence_code;
	}

	public void setSequence_code(int sequence_code) {
		this.sequence_code = sequence_code;
	}
}
