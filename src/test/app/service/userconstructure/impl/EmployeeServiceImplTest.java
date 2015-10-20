/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.service.userconstructure.impl;

import app.model.userconstructure.Company;
import app.model.userconstructure.Department;
import app.model.userconstructure.Employee;
import app.service.form.UserFormServiceImplTestContextConfiguration;
import app.service.userconstructure.CompanyService;
import app.service.userconstructure.DepartmentService;
import app.service.userconstructure.EmployeeService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.AnnotationConfigContextLoader;

import java.io.StringReader;

/**
 * Created by steve on 10/16/15.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = UserFormServiceImplTestContextConfiguration.class, loader = AnnotationConfigContextLoader.class)

public class EmployeeServiceImplTest {
    @Autowired
    EmployeeService employeeService;

    @Test
    public void testGet() {

    }

    @Test
    public void testGetEmployeeByCompanyId() throws Exception {

    }

    @Test
    public void testGetEmployeeByDepartmentId() throws Exception {

    }

    @Test
    public void testDelete() throws Exception {

    }

    @Test
    public void testGet1() throws Exception {

    }

    @Test
    public void testLoad() throws Exception {

    }

    @Test
    public void testLoadAll() throws Exception {

    }

    @Autowired
    CompanyService companyService;
    @Autowired
    DepartmentService departmentService;

    @Test
    public void testSave() throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        StringReader sr = new StringReader("{\"uuid\":null,\"name\":\"newemployee\",\"address\":\"here\",\"phone\":\"there\",\"formType\":\"EmployeeForm\",\"company_id\":\"40288091507179050150717e7e1a0000\",\"parent_id\":\"402880915071abff015071ac06640000\"}");
        Employee employee = mapper.readValue(sr, Employee.class);
        String company_id = employee.getCompany_id();
        System.out.println("company id = " + company_id);
        String parent_id = employee.getParent_id();
        System.out.println("parent id = " + parent_id);
        Company company = companyService.get(parent_id);
        if (company != null) {
            company.getChildren().add(employee);
            employee.setParent(company);
        } else {
            Department parent = departmentService.get(parent_id);
            if (parent != null) {
                parent.getChildren().add(employee);
                employee.setParent(parent);
            } else {
                employee.setParent(companyService.get(company_id));
            }
        }
        employeeService.save(employee);
    }

    @Test
    public void testSaveOrUpdate() throws Exception {

    }

    @Test
    public void testUpdate() throws Exception {
        Employee employee = employeeService.get("402880915071ab62015071ab67ff0000");
        /**
         * set
         * */
        employeeService.update(employee);
    }
}