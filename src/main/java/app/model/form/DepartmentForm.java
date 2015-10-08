package app.model.form;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;


/**
 * 属于部门填写的表单
 * */
@Entity    
@DiscriminatorValue("DepartmentForm")    
public class DepartmentForm extends Form{
	public DepartmentForm(){
		this.setForm_type(FormType.DepartmentForm);
	}
}
