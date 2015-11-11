/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.controller;

import app.model.userfield.JobTitle;
import app.service.userFields.JobTitleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.List;

/**
 * Created by steve on 11/10/15.
 */
@RestController
public class UserJobTitleController {

    @Autowired
    JobTitleService jobTitleService;


    // get list by user id
    @RequestMapping(value = "/jobtitles/user/{userId}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List> getJobTitleByUserId(@PathVariable("userId") int userId) {
        List<JobTitle> list = jobTitleService.getListByUserId(userId);
        return new ResponseEntity<List>(list, HttpStatus.OK);
    }

    @RequestMapping(value = "/jobtitles/delete/", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity deleteJobTitles(@RequestBody String[] jtIds) {
        for (String uuid : jtIds) {
            JobTitle jobTitle = jobTitleService.get(uuid);
            if (jobTitle != null) {
                jobTitleService.delete(jobTitle);
            }
        }

        return new ResponseEntity(HttpStatus.OK);
    }


    @RequestMapping(value = "/jobtitles/", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity saveJobTitle(@RequestBody JobTitle jobTitle) {
        Timestamp date = new Timestamp(new java.util.Date().getTime());
        jobTitle.setCreateTime(date);
        jobTitle.setUpdateTime(date);
        jobTitleService.save(jobTitle);
        return new ResponseEntity(HttpStatus.OK);
    }

    @RequestMapping(value = "/jobtitles/", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity updateJobTitle(@RequestBody JobTitle jobTitle) {
        if (jobTitleService.get(jobTitle.getUuid()) == null)
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        Timestamp date = new Timestamp(new java.util.Date().getTime());
        jobTitle.setUpdateTime(date);
        jobTitleService.update(jobTitle);
        return new ResponseEntity(HttpStatus.OK);
    }
}
