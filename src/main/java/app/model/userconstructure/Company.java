package app.model.userconstructure;

import app.model.forms.FormType;

import javax.persistence.Entity;


@Entity
public class Company extends OrganizationElement {

    public Company() {
        this.setFormType(FormType.CompanyForm);
    }

    private int user_id;


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
        if (obj == null || !(obj instanceof Company))
            return false;
        Company other = (Company) obj;
        return other.getUuid().equals(this.getUuid());
    }
}
