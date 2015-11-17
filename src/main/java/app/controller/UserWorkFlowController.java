/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.controller;

import app.model.forms.Form;
import app.model.report.Record;
import app.model.wordflow.WorkFlow;
import app.model.wordflow.WorkFlowNode;
import app.model.wordflow.workflowUser.UserWorkFlow;
import app.service.question.QuestionService;
import app.service.question.RecordService;
import app.service.userworkflow.UserWorkFlowService;
import app.service.workflow.WorkFlowNodeService;
import app.service.workflow.WorkFlowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
        List<UserWorkFlow> list = userWorkFlowService.findUserWorkFlow(userWorkFlow.getUser_id(), userWorkFlow.getWorkFlowId(),userWorkFlow.getOe_id());
        if(list.size() == 0 || list.get(0).getCurrentNode() == null){
            WorkFlow wf = workFlowService.get(userWorkFlow.getWorkFlowId());
            userWorkFlow.setCurrentNode(wf.getStartNode_id());
            userWorkFlowService.save(userWorkFlow);
        }else{
            userWorkFlow = list.get(0);
        }
        WorkFlowNode currentNode = workFlowNodeService.get(userWorkFlow.getCurrentNode());
        return new ResponseEntity<>(currentNode,HttpStatus.OK);
    }

    @RequestMapping(value="/user/workflow/go/",method=RequestMethod.PUT,produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<WorkFlowNode> goToNode(@RequestBody UserWorkFlow userWorkFlow){
        List<UserWorkFlow> list = userWorkFlowService.findUserWorkFlow(userWorkFlow.getUser_id(), userWorkFlow.getWorkFlowId(),userWorkFlow.getOe_id());
        if(list.size() == 0){
            WorkFlow wf = workFlowService.get(userWorkFlow.getWorkFlowId());
            userWorkFlow.setCurrentNode(wf.getStartNode_id());
            userWorkFlowService.save(userWorkFlow);
        }else{
            list.get(0).setCurrentNode(userWorkFlow.getCurrentNode());
            userWorkFlowService.update(list.get(0));
        }
        WorkFlowNode currentNode = workFlowNodeService.get(userWorkFlow.getCurrentNode());
        return new ResponseEntity<>(currentNode,HttpStatus.OK);
    }
    @Autowired
    RecordService recordService;
    @RequestMapping(value="/user/workflow/submit/",method=RequestMethod.POST,produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Record> submitRecord(@RequestBody Record record){
        String oeId =record.getOeId();
        String questionId = record.getQuestionId();
        int userId = record.getUserId();
        Map<String, Object> map = new HashMap<>();
        map.put("oeId",oeId);
        map.put("userId",userId);
        map.put("questionId",questionId);
        List<Record> list = recordService.getListbyParams(map);
        if(list.size() == 0){
            recordService.save(record);
        }else{
            list.get(0).setValue(record.getValue());
            recordService.update(list.get(0));
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }
    @RequestMapping(value="/user/workflow/value/",method=RequestMethod.POST,produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Record> getRecord(@RequestBody Record record){
        String oeId =record.getOeId();
        String questionId = record.getQuestionId();
        int userId = record.getUserId();
        Map<String, Object> map = new HashMap<>();
        map.put("oeId",oeId);
        map.put("userId",userId);
        map.put("questionId",questionId);

        List<Record> list = recordService.getListbyParams(map);
        if(list.size() == 0){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }else{
            return new ResponseEntity<>(list.get(0),HttpStatus.OK);
        }
    }
}
