/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.controller;

import app.model.forms.FormType;
import app.model.userconstructure.Company;
import app.model.userconstructure.Department;
import app.model.userconstructure.Employee;
import app.model.userconstructure.OrganizationElement;
import app.service.userconstructure.CompanyService;
import app.service.userconstructure.DepartmentService;
import app.service.userconstructure.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.util.List;

/**
 * Created by steve on 10/16/15.
 */
@RestController
public class DepartmentController {
    //-------------------Retrieve All Company--------------------------------------------------------

    @Autowired
    DepartmentService departmentService;
    @RequestMapping(value = "/department/", method = RequestMethod.GET)
    public ResponseEntity<List<Department>> listAllDepartment() {
        List<Department> departments = departmentService.loadAll();
        if (departments.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(departments, HttpStatus.OK);
    }

    //-------------------Retrieve Single Department--------------------------------------------------------

    @RequestMapping(value = "/department/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Department> getDepartment(@PathVariable("id") String id) {
        Department department = departmentService.get(id);
        System.out.println(department);
        if (department == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        // System.out.println(new ResponseEntity<Company>(company, HttpStatus.OK).toString()	);
        return new ResponseEntity<>(department, HttpStatus.OK);
    }


    //-------------------Create a Department--------------------------------------------------------

    @Autowired
    CompanyService companyService;
    @RequestMapping(value = "/department/", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Department> createDepartment(@RequestBody Department department, HttpServletResponse response) {
        String company_id = department.getCompany_id();
        System.out.println("company id = " + company_id);
        String parent_id = department.getParent_id();
        System.out.println("parent id = " + parent_id);
        Company company = companyService.get(parent_id);
        if(company!=null){
            company.getChildren().add(department);
            department.setParent(company);
        }else{
            Department parent = departmentService.get(parent_id);
            if(parent!=null){
                parent.getChildren().add(department);
                department.setParent(parent);
            }
        }
        departmentService.save(department);
        return new ResponseEntity<>(department, HttpStatus.CREATED);
    }


    //------------------- Update a Department --------------------------------------------------------

    @RequestMapping(value = "/department/{id}", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Department> updateDepartment(@PathVariable("id") String id, @RequestBody Department department) {
        System.out.println("Updating department ======> " + id);

        String company_id = department.getCompany_id();
        System.out.println("company id = " + company_id);
        String parent_id = department.getParent_id();
        System.out.println("parent id = " + parent_id);
        Company company = companyService.get(parent_id);
        if(company!=null){
            company.getChildren().add(department);
            department.setParent(company);
        }else{
            Department parent = departmentService.get(parent_id);
            if(parent!=null){
                parent.getChildren().add(department);
                department.setParent(parent);
            }else{
                department.setParent(companyService.get(company_id));
            }
        }
        departmentService.update(department);
        return new ResponseEntity<>(department, HttpStatus.OK);
    }


    //------------------- Delete a company --------------------------------------------------------

    @Autowired
    EmployeeService employeeService;
    @RequestMapping(value = "/department/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Department> deleteUser(@PathVariable("id") String id) {
        System.out.println("Fetching & Deleting User with id " + id);

        Department department = departmentService.get(id);
        if(department == null)
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        for(OrganizationElement organizationElement :department.getChildren()){
            organizationElement.setParent(department.getParent());
            System.out.println(organizationElement.getFormType());
            if(organizationElement.getFormType().equals(FormType.DepartmentForm)){
                departmentService.update((Department)organizationElement);
            }else {
                employeeService.update((Employee)organizationElement);
            }
        }
        department.getChildren().clear();
        departmentService.delete(department);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
