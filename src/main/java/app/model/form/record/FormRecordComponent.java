package app.model.form.record;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.LazyToOne;
import org.hibernate.annotations.LazyToOneOption;

import com.fasterxml.jackson.annotation.JsonIgnore;

import app.model.form.FormComponent;


@Entity
@Table(name="tbl_form_record_component")
public class FormRecordComponent {
	@Id
	@GeneratedValue(generator = "idGenerator")
	@GenericGenerator(name = "idGenerator", strategy = "uuid")
	@Column(name = "id", nullable = false)
	private String id;
	private String value;

	
	
	@OneToOne(fetch = FetchType.EAGER)
	@LazyToOne(LazyToOneOption.FALSE)
	private FormComponent fComponent;
	
	@JsonIgnore
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "form_record_id")
	private FormRecord formrecord;
	
	
	
	public FormComponent getfComponent() {
		return fComponent;
	}
	public void setfComponent(FormComponent fComponent) {
		this.fComponent = fComponent;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}
	public FormRecord getFormrecord() {
		return formrecord;
	}
	public void setFormrecord(FormRecord frz) {
		this.formrecord = frz;
	}
	
}
