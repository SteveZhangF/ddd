/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.controller;

import app.model.userconstructure.Company;
import app.model.userconstructure.Employee;
import app.service.userconstructure.CompanyService;
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
public class EmployeeController {

    @Autowired
    EmployeeService employeeService;


    // get employees of a company by user id

    @RequestMapping(value = "/employee/getbyUser/{userId}", method = RequestMethod.GET)
    public ResponseEntity<List<Employee>> listEmployeebyUserId(@PathVariable("userId") int userId) {
        List<Employee> employees = employeeService.getEmployeebyUserId(userId);
        if (employees.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(employees, HttpStatus.OK);
    }

    @RequestMapping(value = "/employee/getPersonDetail/{uuid}", method = RequestMethod.GET)
    public ResponseEntity<Employee> getEmployeePersonDetailbyId(@PathVariable("uuid") String uuid){
        Employee employee = employeeService.getEmployeePersonDetailbyId(uuid);
        if(employee!=null){
            return new ResponseEntity<>(employee,HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


    @RequestMapping(value = "/employee/getJobDetail/{uuid}", method = RequestMethod.GET)
    public ResponseEntity<Employee> getEmployeeJobDetailbyId(@PathVariable("uuid") String uuid){
        Employee employee = employeeService.getEmployeeJobDetailbyId(uuid);
        if(employee!=null){
            return new ResponseEntity<>(employee,HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }



    @RequestMapping(value = "/employee/", method = RequestMethod.GET)
    public ResponseEntity<List<Employee>> listAllDepartment() {
        List<Employee> employees = employeeService.loadAll();
        if (employees.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(employees, HttpStatus.OK);
    }

    //-------------------Retrieve Single Employee--------------------------------------------------------

    @RequestMapping(value = "/employee/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Employee> getDepartment(@PathVariable("id") String id) {
        Employee employee = employeeService.get(id);
        System.out.println(employeeService);
        if (employee == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        // System.out.println(new ResponseEntity<Company>(company, HttpStatus.OK).toString()	);
        return new ResponseEntity<>(employee, HttpStatus.OK);
    }


    //-------------------Create a Employee--------------------------------------------------------

    @Autowired
    CompanyService companyService;
    @RequestMapping(value = "/employee/", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Employee> createEmployee(@RequestBody Employee employee, HttpServletResponse response) {
        employeeService.save(employee);
        return new ResponseEntity<>(employee, HttpStatus.OK);
    }


    //------------------- Update a Employee --------------------------------------------------------

    @RequestMapping(value = "/employee/{id}", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Employee> updateDepartment(@PathVariable("id") String id, @RequestBody Employee employee) {
        System.out.println("Updating employee ======> " + id);
        employeeService.update(employee);
        return new ResponseEntity<>(employee, HttpStatus.OK);
    }


    //------------------- Delete a Employee --------------------------------------------------------

    @RequestMapping(value = "/employee/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Employee> deleteEmployee(@PathVariable("id") String id) {
        System.out.println("Fetching & Deleting Employee with id " + id);
        Employee employee = employeeService.get(id);
        if (employee == null) {
            System.out.println("Unable to delete. Employee with id " + id + " not found");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        employeeService.delete(employee);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    //------------------- Delete Employees --------------------------------------------------------

    @RequestMapping(value = "/employee/deleteMany/", method = RequestMethod.POST)
    public ResponseEntity<Employee> deleteEmployees(@RequestBody String[] ids) {
        for(String id:ids){
            try {
                System.out.println("Fetching & Deleting Employee with id " + id);
                Employee employee = employeeService.get(id);
                if (employee == null) {
                    System.out.println("Unable to delete. Employee with id " + id + " not found");
                    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                }
                employeeService.delete(employee);
            }catch (Exception e){
                return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
            }
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }



}
