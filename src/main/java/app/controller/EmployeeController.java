/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.controller;

import app.message.Message;
import app.model.userconstructure.Company;
import app.model.userconstructure.Employee;
import app.model.userfield.EmploymentStatus;
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

    @RequestMapping(value = "/user/{userId}/employee/", method = RequestMethod.GET)
    public ResponseEntity<Message> listEmployeebyUserId(@PathVariable("userId") int userId) {
        List<Employee> employees = employeeService.getEmployeebyUserId(userId);
        return new ResponseEntity<>(Message.getSuccessMsg("Load employees success",employees), HttpStatus.OK);
    }


    /**
     * load an employee
     * */
    @RequestMapping(value = "/user/{userId}/employee/{Id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Message> getEmployeeByUserIdAndId(@PathVariable("Id") String id,@PathVariable("userId") int userId) {
        Employee employee = employeeService.get(id);
        if (employee == null) {
            return new ResponseEntity<>(Message.getFailMsg("No such employee"),HttpStatus.OK);
        }
        if(employee.getUserId()!=userId){
            return new ResponseEntity<>(Message.getFailMsg("No such employee in your company"),HttpStatus.OK);
        }
        return new ResponseEntity<>(Message.getSuccessMsg("Load employee success",employee), HttpStatus.OK);
    }


    //-------------------Create a Employee--------------------------------------------------------

    @Autowired
    CompanyService companyService;
    @RequestMapping(value = "/user/{userId}/employee/", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Message> createEmployee(@RequestBody Employee employee, @PathVariable int userId) {
        employee.setUserId(userId);
        employeeService.save(employee);
        List<Employee> list = employeeService.getEmployeebyUserId(userId);
        return new ResponseEntity<>(Message.getSuccessMsg("Add employee success",list), HttpStatus.OK);
    }


    //------------------- Update a Employee --------------------------------------------------------

    @RequestMapping(value = "/user/{userId}/employee/{id}", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Message> updateDepartment(@PathVariable("id") String id,@PathVariable int userId, @RequestBody Employee employee) {
        employee.setUserId(userId);
        employeeService.update(employee);
        List<Employee> list = employeeService.getEmployeebyUserId(userId);
        return new ResponseEntity<>(Message.getSuccessMsg("Update employee success",list), HttpStatus.OK);
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
