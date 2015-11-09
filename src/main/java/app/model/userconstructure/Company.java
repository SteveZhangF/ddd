package app.model.userconstructure;

import app.model.forms.FormType;

import javax.persistence.Entity;


@Entity
public class Company extends OrganizationElement {

    public Company() {
        this.setFormType(FormType.CompanyForm);
    }

    private String taxId;
    private String registNum;
    private String fax;

    public String getTaxId() {
        return taxId;
    }

    public void setTaxId(String taxId) {
        this.taxId = taxId;
    }

    public String getRegistNum() {
        return registNum;
    }

    public void setRegistNum(String registNum) {
        this.registNum = registNum;
    }

    public String getFax() {
        return fax;
    }

    public void setFax(String fax) {
        this.fax = fax;
    }
}
