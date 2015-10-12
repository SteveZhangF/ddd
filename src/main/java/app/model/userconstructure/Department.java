package app.model.userconstructure;

import app.model.form.FormType;

import javax.persistence.Entity;


@Entity
public class Department extends OrganizationElement {

    public Department() {
        this.setFormType(FormType.DepartmentForm);
    }

    @Override
    public String show(OrganizationElement oe) {
        return "";
    }


}
