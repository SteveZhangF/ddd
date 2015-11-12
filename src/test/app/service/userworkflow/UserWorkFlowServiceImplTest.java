///*
// * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
// * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
// * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
// * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
// * Vestibulum commodo. Ut rhoncus gravida arcu.
// */
//
//package app.service.userworkflow;
//
//import app.model.wordflow.WorkFlow;
//import app.model.wordflow.WorkFlowNode;
//import app.model.wordflow.workflowUser.UserWorkFlow;
//import app.service.form.UserFormServiceImplTestContextConfiguration;
//import app.service.workflow.WorkFlowNodeService;
//import app.service.workflow.WorkFlowService;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.junit.Test;
//import org.junit.runner.RunWith;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.test.context.ContextConfiguration;
//import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
//import org.springframework.test.context.support.AnnotationConfigContextLoader;
//
//import java.io.StringWriter;
//import java.util.List;
//
//import static org.junit.Assert.*;
//
///**
// * Created by steve on 10/25/15.
// */
//@RunWith(SpringJUnit4ClassRunner.class)
//@ContextConfiguration(classes = UserFormServiceImplTestContextConfiguration.class, loader = AnnotationConfigContextLoader.class)
//public class UserWorkFlowServiceImplTest {
//
//    @Autowired
//    UserWorkFlowService userWorkFlowService;
//    @Autowired
//    WorkFlowService workFlowService;
//    @Autowired
//    WorkFlowNodeService workFlowNodeService;
//    @Test
//    public void testFindUserWorkFlow() throws Exception {
//        int userid = 1;
//        String workflowid = "40288085509cd72e01509cd7869a0000";
//        UserWorkFlow userWorkFlow = new UserWorkFlow();
//
//        userWorkFlow.setUser_id(userid);
//        userWorkFlow.setWorkFlowId(workflowid);
//
//        List<UserWorkFlow> list = userWorkFlowService.findUserWorkFlow(userWorkFlow.getUser_id(), userWorkFlow.getWorkFlowId());
//        if(list.size() == 0){
//            WorkFlow wf = workFlowService.get(userWorkFlow.getWorkFlowId());
//            userWorkFlow.setCurrentNode(wf.getStartNode_id());
//            userWorkFlowService.save(userWorkFlow);
//        }else{
//            userWorkFlow = list.get(0);
//        }
//        WorkFlowNode currentNode = workFlowNodeService.get(userWorkFlow.getCurrentNode());
//        System.out.println(currentNode.getName());
//        ObjectMapper mapper = new ObjectMapper();
//        StringWriter writer = new StringWriter();
//        mapper.writeValue(writer,currentNode);
//        System.out.println(writer.toString());
//
//    }
//}