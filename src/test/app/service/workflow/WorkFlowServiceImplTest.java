/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.service.workflow;

import app.model.form.FormTable;
import app.model.wordflow.*;
import app.service.form.FormService;
import app.service.form.UserFormServiceImplTestContextConfiguration;
import junit.framework.TestCase;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.AnnotationConfigContextLoader;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import static org.junit.Assert.*;

/**
 * Created by steve on 10/14/15.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = UserFormServiceImplTestContextConfiguration.class,loader = AnnotationConfigContextLoader.class)
public class WorkFlowServiceImplTest extends TestCase {
    @Autowired
    WorkFlowService workFlowService;

    @Before
    public void setUp() throws Exception {

    }

    @After
    public void tearDown() throws Exception {

    }

    @Test
    public void testDelete() throws Exception {

    }

    @Test
    public void testGet() throws Exception {
//        WorkFlow workFlow = workFlowService.get("4028809150695a820150695a89a30000");


    }

    @Test
    public void testLoad() throws Exception {
    }

    @Test
    public void testLoadAll() throws Exception {
//        List<WorkFlow> list = workFlowService.loadAll();
//        for(WorkFlow wf: list){
//        }

    }
//
//    @Autowired
//    FormService formService;
//    @Test
//    public void testSave() throws Exception {
//        WorkFlow workFlow = new WorkFlow();
//        FormTable formTable = formService.get(8);
//        WorkFlowNode workFlowNode = new WorkFlowNode();
//        workFlowNode.setWorkFlowNodeElement(formTable);
//        workFlowNode.setDisplayName("NIUBI");
//        workFlowNode.setDiagramId("state_flow1");
//
//
//
//
//        //start
//        WorkFlowNode start = new WorkFlowNode();
//        StartWorkFlowNodeElement startWorkFlowNodeElement = new StartWorkFlowNodeElement();
//        startWorkFlowNodeElement.setName("Start");
//        startWorkFlowNodeElement.setId(0);
//        start.setWorkFlowNodeElement(startWorkFlowNodeElement);
//        //end
//        WorkFlowNode end = new WorkFlowNode();
//        EndWorkFlowNodeElement endWorkFlowNodeElement = new EndWorkFlowNodeElement();
//        endWorkFlowNodeElement.setName("End");
//        endWorkFlowNodeElement.setId(0);
//        end.setWorkFlowNodeElement(endWorkFlowNodeElement);
//
//        WorkFlowConnection workFlowConnection1 = new WorkFlowConnection();
//        workFlowConnection1.setSource(start);
//        workFlowConnection1.setTarget(workFlowNode);
//        workFlowConnection1.setConnectionType(ConnectionType.DefaultConnection.getValue());
//
//        WorkFlowConnection workFlowConnectionEnd = new WorkFlowConnection();
//        workFlowConnectionEnd.setSource(workFlowNode);
//        workFlowConnectionEnd.setTarget(end);
//
//        workFlow.addNode(workFlowNode);
//        workFlow.addNode(start);
//        workFlow.addNode(end);
//        workFlow.addConnection(workFlowConnection1);
//        workFlow.addConnection(workFlowConnectionEnd);
//
//        workFlowService.save(workFlow);
//    }

    @Test
    public void testSaveOrUpdate() throws Exception {

    }

    @Test
    public void testUpdate() throws Exception {

    }
}