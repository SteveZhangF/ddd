package app.model.userconstructure;

import app.model.form.FormType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.*;

import javax.persistence.*;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.ArrayList;
import java.util.List;

import static javax.persistence.CascadeType.*;


@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@Table(name = "organizationelement")
public abstract class OrganizationElement {

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
    @JoinColumn(name = "parent_id")
    @JsonIgnore
    private OrganizationElement parent;

    @OneToMany(mappedBy = "parent") // --->
    @Cascade(value = org.hibernate.annotations.CascadeType.ALL)
    @LazyCollection(LazyCollectionOption.FALSE) // --->
    private List<OrganizationElement> children = new ArrayList<>();

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


    @Override
    public String toString() {
        return "[uuid=" + uuid + ", name=" + name + ", address=" + address
                + ", phone=" + phone + "]";
    }


    public OrganizationElement getParent() {
        return parent;
    }

    public void setParent(OrganizationElement parent) {
        this.parent = parent;
    }

    @Transient
    private String parent_id;

    public String getParent_id() {
        return parent_id;
    }

    public void setParent_id(String parent_id) {
        this.parent_id = parent_id;
    }
}
