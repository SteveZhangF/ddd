/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.controller;

import app.helper.FormParser;
import app.helper.WorkFlowGenerator;
import app.model.form.FormTable;
import app.model.wordflow.WorkFlow;
import app.service.workflow.WorkFlowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

/**
 * Created by steve on 10/16/15.
 */



@RestController
public class WorkFlowController {

    //-------------------Retrieve All WorkFlows --------------------------------------------------------

    @Autowired
    WorkFlowService workFlowService;
    @RequestMapping(value = "/workflow/", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<WorkFlow>> getAllWorkFlow() {
        List<WorkFlow> workFlows = workFlowService.loadAll();
        if (workFlows.isEmpty()) {
            return new ResponseEntity<List<WorkFlow>>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<List<WorkFlow>>(workFlows, HttpStatus.OK);
    }

    @RequestMapping(value = "/workflow/{id}",method = RequestMethod.GET,produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<WorkFlow> getOneWorkFlow(@PathVariable("id") String id){
        WorkFlow workFlow = workFlowService.get(id);
        if(workFlow == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(workFlow,HttpStatus.OK);
    }

    @RequestMapping(value = "/workflow/", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<WorkFlow> createWorkFlow(@RequestBody String json) {
        try {
            WorkFlow workFlow = new WorkFlowGenerator().createWorkFlow(json);
            workFlowService.save(workFlow);
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<WorkFlow>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>( HttpStatus.CREATED);
    }

    //------------------- Update a WorkFlow (maybe not useful) --------------------------------------------------------

    @RequestMapping(value = "/workflow/{id}", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<WorkFlow> updateFormTable(@PathVariable("id") String id, @RequestBody WorkFlow workFlow) {
        workFlowService.update(workFlow);
        return new ResponseEntity<>( HttpStatus.OK);
    }


    //------------------- Delete a formtable --------------------------------------------------------

    @RequestMapping(value = "/workflow/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<WorkFlow> deleteFormbyID(@PathVariable("id") String id) {

        WorkFlow workFlow = workFlowService.get(id);
        if (workFlow == null) {
            System.out.println("Unable to delete. WorkFlow with id " + id + " not found");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        workFlowService.delete(workFlow);
        return new ResponseEntity<>(HttpStatus.OK);
    }


}
