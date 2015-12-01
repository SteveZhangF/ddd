/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.controller;

import app.message.Message;
import app.model.files.FileElement;
import app.model.files.FileFileElement;
import app.model.files.FolderFileElement;
import app.model.files.QuestionFileElement;
import app.model.report.Record;
import app.model.user.User;
import app.model.userconstructure.Employee;
import app.service.file.FileService;
import app.service.system.UserService;
import app.service.userconstructure.CompanyService;
import app.service.userconstructure.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by steve on 10/16/15.
 */
@RestController
public class EmployeeController {

    @Autowired
    EmployeeService employeeService;
    @Autowired
    UserService userService;
    @Autowired
    FileService fileService;


    // get employees of a employee by user id

    @RequestMapping(value = "/user/{userId}/employee/", method = RequestMethod.GET)
    public ResponseEntity<Message> listEmployeebyUserId(@PathVariable("userId") int userId) {
        List<Employee> employees = employeeService.getEmployeebyUserId(userId);
        return new ResponseEntity<>(Message.getSuccessMsg("Load employees success", employees), HttpStatus.OK);
    }

    // get employees of a employee with percent of one employee report by user id

    @RequestMapping(value = "/user/{userId}/employee/report/{reportId}", method = RequestMethod.GET)
    public ResponseEntity<Message> listEmployeebyUserId(@PathVariable("userId") int userId,@PathVariable String reportId) {
        List<Employee> employees = employeeService.getListWithRecordsforListByUserId(userId);
        FileElement fileElement = fileService.get(reportId);
        if(fileElement.getType().equals(FileElement.FileType.FILE)){
            FileFileElement fileFileElement = (FileFileElement) fileElement;
            if(fileFileElement.getFileType().equals(FileFileElement.FileFileType.EmployeeReport)){
                List<QuestionFileElement> questions = fileFileElement.getQuestions();
                for(Employee employee:employees){
                    double finish = 0.0d;
                    List<Record> records = employee.getRecords();
                    for(QuestionFileElement question:questions){
                        for(Record record:records){
                            if(question.getId().equals(record.getQuestionId()) && record.getValue()!=null && !record.getValue().trim().equals("")){
                                finish++;
                                break;
                            }
                        }
                    }
                    double percent = finish/questions.size();
                    employee.setPercent(percent);
                }
            }
        }
        return new ResponseEntity<>(Message.getSuccessMsg("Load employees success", employees), HttpStatus.OK);
    }




    /**
     * load an employee
     */
    @RequestMapping(value = "/user/{userId}/employee/{Id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Message> getEmployeeByUserIdAndId(@PathVariable("Id") String id, @PathVariable("userId") int userId) {
        Employee employee = employeeService.get(id);
        if (employee == null) {
            return new ResponseEntity<>(Message.getFailMsg("No such employee"), HttpStatus.OK);
        }
        if (employee.getUserId() != userId) {
            return new ResponseEntity<>(Message.getFailMsg("No such employee in your company"), HttpStatus.OK);
        }
        return new ResponseEntity<>(Message.getSuccessMsg("Load employee success", employee), HttpStatus.OK);
    }




    //-------------------Create a Employee--------------------------------------------------------

    @Autowired
    CompanyService companyService;

    @RequestMapping(value = "/user/{userId}/employee/", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Message> createEmployee(@RequestBody Employee employee, @PathVariable int userId) {
        employee.setUserId(userId);
        employeeService.save(employee);
        List<Employee> list = employeeService.getEmployeebyUserId(userId);
        return new ResponseEntity<>(Message.getSuccessMsg("Add employee success", list), HttpStatus.OK);
    }


    //------------------- Update a Employee --------------------------------------------------------

    @RequestMapping(value = "/user/{userId}/employee/{id}", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Message> updateDepartment(@PathVariable("id") String id, @PathVariable int userId, @RequestBody Employee employee) {
        employee.setUserId(userId);
        employeeService.update(employee);
        List<Employee> list = employeeService.getEmployeebyUserId(userId);
        return new ResponseEntity<>(Message.getSuccessMsg("Update employee success", list), HttpStatus.OK);
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

    @RequestMapping(value = "/user/employee/deleteMany/", method = RequestMethod.POST)
    public ResponseEntity<Message> deleteEmployees(@RequestBody String[] ids) {
        for (String id : ids) {
            Employee employee = employeeService.get(id);
            if (employee == null) {
                return new ResponseEntity<>(Message.getFailMsg("Unable to delete Employee"),HttpStatus.OK);
            }
            employeeService.delete(employee);
        }
        return new ResponseEntity<>(Message.getSuccessMsg("Delete employee success!",""),HttpStatus.OK);
    }



    /**
     * get customized employee fields of userId
     * */
    @RequestMapping(value="/user/employee/getFields/{userId}",method = RequestMethod.GET)
    public ResponseEntity<Message> getCustomizedField(@PathVariable int userId) {
        User user = userService.get(userId);
        if(user == null){
            return new ResponseEntity<>(Message.getFailMsg("Load User Failed"),HttpStatus.OK);
        }

        FileElement.FileType[] type = {FileElement.FileType.EMPLOYEE_FIELD};
        List<FolderFileElement> folders = user.getFolders();
        List<FileElement> result = new ArrayList<>();
        for(FolderFileElement folder: folders){
            result.addAll(fileService.getChildrenByParentIdAndTypes(folder.getId(), type, false));
        }
        return new ResponseEntity<>(Message.getSuccessMsg("Load fields success!",result),HttpStatus.OK);
    }


}
