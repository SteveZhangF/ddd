/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.controller;

import app.model.forms.Form;
import app.model.wordflow.WorkFlow;
import app.model.wordflow.WorkFlowNode;
import app.model.wordflow.workflowUser.UserWorkFlow;
import app.service.question.QuestionService;
import app.service.userworkflow.UserWorkFlowService;
import app.service.workflow.WorkFlowNodeService;
import app.service.workflow.WorkFlowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

/**
 * Created by steve on 10/25/15.
 */
@RestController
public class UserWorkFlowController {

    @Autowired
    UserWorkFlowService userWorkFlowService;
    @Autowired
    WorkFlowService workFlowService;
    @Autowired
    WorkFlowNodeService workFlowNodeService;

    @RequestMapping(value = "/user/workflow/", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<WorkFlowNode> getCurrentNode( @RequestBody UserWorkFlow userWorkFlow) throws IOException {
        List<UserWorkFlow> list = userWorkFlowService.findUserWorkFlow(userWorkFlow.getUser_id(), userWorkFlow.getWorkFlowId());
        if(list.size() == 0){
            WorkFlow wf = workFlowService.get(userWorkFlow.getWorkFlowId());
            userWorkFlow.setCurrentNode(wf.getStartNode_id());
            userWorkFlowService.save(userWorkFlow);
        }else{
            userWorkFlow = list.get(0);
        }
        WorkFlowNode currentNode = workFlowNodeService.get(userWorkFlow.getCurrentNode());
        return new ResponseEntity<>(currentNode,HttpStatus.OK);
    }

}
