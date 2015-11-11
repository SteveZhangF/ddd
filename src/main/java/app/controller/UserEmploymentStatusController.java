/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.controller;

import app.model.userfield.EmploymentStatus;
import app.service.userFields.EmploymentStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.List;

/**
 * Created by steve on 11/10/15.
 */
@RestController
public class UserEmploymentStatusController {

    @Autowired
    EmploymentStatusService employmentStatusService;
    // get list by user id
    @RequestMapping(value = "/employmentStatus/user/{userId}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List> getEmploymentStatusByUserId(@PathVariable("userId") int userId) {
        List<EmploymentStatus> list = employmentStatusService.getListByUserId(userId);
        return new ResponseEntity<List>(list, HttpStatus.OK);
    }

    @RequestMapping(value = "/employmentStatus/delete/", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity employmentStatusService(@RequestBody String[] jtIds) {
        for (String uuid : jtIds) {
            EmploymentStatus employmentStatus = employmentStatusService.get(uuid);
            if (employmentStatus != null) {
                employmentStatusService.delete(employmentStatus);
            }
        }

        return new ResponseEntity(HttpStatus.OK);
    }


    @RequestMapping(value = "/employmentStatus/", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity saveEmploymentStatus(@RequestBody EmploymentStatus employmentStatus) {
        Timestamp date = new Timestamp(new java.util.Date().getTime());
        employmentStatus.setCreateTime(date);
        employmentStatus.setUpdateTime(date);
        employmentStatusService.save(employmentStatus);

        return new ResponseEntity(HttpStatus.OK);
    }

    @RequestMapping(value = "/employmentStatus/", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity updateEmploymentStatus(@RequestBody EmploymentStatus employmentStatus) {
        if (employmentStatusService.get(employmentStatus.getUuid()) == null)
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        Timestamp date = new Timestamp(new java.util.Date().getTime());
        employmentStatus.setUpdateTime(date);
        employmentStatusService.update(employmentStatus);
        return new ResponseEntity(HttpStatus.OK);
    }
}
