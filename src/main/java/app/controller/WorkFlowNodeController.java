/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.controller;

import app.model.wordflow.WorkFlow;
import app.model.wordflow.WorkFlowNode;
import app.service.workflow.WorkFlowNodeService;
import app.service.workflow.WorkFlowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Created by steve on 10/24/15.
 */
@RestController
public class WorkFlowNodeController {


    @Autowired
    WorkFlowNodeService workFlowNodeService;

    @RequestMapping(value = "/user/workflownode/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<WorkFlowNode> getOneWorkFlowNodeForUser(@PathVariable("id") String id) {
        WorkFlowNode workFlown = workFlowNodeService.get(id);
        if (workFlown == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(workFlown, HttpStatus.OK);
    }

    @RequestMapping(value = "/workflownode/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<WorkFlowNode> getOneWorkFlowNode(@PathVariable("id") String id) {
        WorkFlowNode workFlown = workFlowNodeService.get(id);
        if (workFlown == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(workFlown, HttpStatus.OK);
    }

    @RequestMapping(value = "/workflownode/", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<WorkFlowNode> createWorkFlowNode(@RequestBody WorkFlowNode workFlown) {
//            WorkFlow workFlow = new WorkFlowGenerator().createWorkFlow(json);
        workFlowNodeService.save(workFlown);
        return new ResponseEntity<>(workFlown,HttpStatus.CREATED);
    }

    //------------------- Update a WorkFlow (maybe not useful) --------------------------------------------------------

    @RequestMapping(value = "/workflownode/{id}", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<WorkFlowNode> updateFormTable(@PathVariable("id") String id, @RequestBody WorkFlowNode workFlowNode) {
        workFlowNodeService.update(workFlowNode);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    //------------------- Delete a wfn --------------------------------------------------------

    @RequestMapping(value = "/workflownode/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<WorkFlowNode> deleteWorkflowById(@PathVariable("id") String id) {

        WorkFlowNode workFlowNode = workFlowNodeService.get(id);
        if (workFlowNode == null) {
            System.out.println("Unable to delete. WorkFlow node with id " + id + " not found");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        workFlowNodeService.delete(workFlowNode);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
