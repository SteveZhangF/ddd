package app.model.form;

import java.util.List;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

import org.hibernate.hql.internal.ast.tree.LiteralNode;

/**
 * 属于员工填写的表单
 * */
@Entity    
@DiscriminatorValue("EmployeeForm")    
public class EmployeeForm  extends Form{
	public EmployeeForm(){
		this.setForm_type(FormType.EmployeeForm);
	}
}
