package app.model.userconstructure;

import app.model.files.EmployeeFieldFileElement;
import app.model.forms.FormType;
import app.model.report.Record;
import app.model.userfield.EmploymentStatus;
import app.model.userfield.JobTitle;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.sql.Date;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Entity
public class Employee extends OrganizationElement {
//    {
//        "firstName":"dd", "lastName":"dd", "driverLicenseNum":"dd", "ssn":"dd", "driverLicenseExp":
//        "2015-11-04T06:00:00.000Z", "maritalStatus":"married", "gender":"female", "nationality":"AX", "birthday":
//        "2015-11-03T06:00:00.000Z", "email":"zhangke3012@gmail.com", "phone":"6827013278", "address":
//        "Dallas Auto Glass, K Avenue, Plano, TX, United States"
//    }

    public Employee() {
        this.setFormType(FormType.EmployeeForm);
    }

    /**
     * person detail
     */
    private String imagePath;
    private String firstName;
    private String lastName;
    private String driverLicenseNum;
    private String ssn;
    private Date driverLicenseExp;
    private String maritalStatus;
    private String gender;
    private String nationality;
    private String birthday;

    private Date startDate;
    private Date endDate;

    @Transient
    private double percent;

    public double getPercent() {
        return percent;
    }

    public void setPercent(double percent) {
        this.percent = percent;
    }
    //    @ElementCollection(fetch=FetchType.EAGER)
//    @Column(name="tableName")
//    private Map<EmployeeFieldFileElement,String> customizedFields = new HashMap();

    @OneToMany(cascade = CascadeType.ALL)
    @LazyCollection(LazyCollectionOption.FALSE)
    @Cascade(org.hibernate.annotations.CascadeType.REMOVE)
    private List<Record> records = new ArrayList<>();

    public List<Record> getRecords() {
        return records;
    }

    public void setRecords(List<Record> records) {
        this.records = records;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getDriverLicenseNum() {
        return driverLicenseNum;
    }

    public void setDriverLicenseNum(String driverLicenseNum) {
        this.driverLicenseNum = driverLicenseNum;
    }

    public String getSsn() {
        return ssn;
    }

    public void setSsn(String ssn) {
        this.ssn = ssn;
    }

    public Date getDriverLicenseExp() {
        return driverLicenseExp;
    }

    public void setDriverLicenseExp(Date driverLicenseExp) {
        this.driverLicenseExp = driverLicenseExp;
    }

    public String getMaritalStatus() {
        return maritalStatus;
    }

    public void setMaritalStatus(String maritalStatus) {
        this.maritalStatus = maritalStatus;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getNationality() {
        return nationality;
    }

    public void setNationality(String nationality) {
        this.nationality = nationality;
    }

    public String getBirthday() {
        return birthday;
    }

    public void setBirthday(String birthday) {
        this.birthday = birthday;
    }


    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

//    public Map<EmployeeFieldFileElement, String> getCustomizedFields() {
//        return customizedFields;
//    }
//
//    public void setCustomizedFields(Map<EmployeeFieldFileElement, String> customizedFields) {
//        this.customizedFields = customizedFields;
//    }
}
