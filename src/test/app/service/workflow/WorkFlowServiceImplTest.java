/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.service.workflow;

import app.helper.WorkFlowGenerator;
import app.model.wordflow.WorkFlow;
import app.model.wordflow.WorkFlowNode;
import app.service.form.UserFormServiceImplTestContextConfiguration;
import com.fasterxml.jackson.databind.ObjectMapper;
import junit.framework.TestCase;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.AnnotationConfigContextLoader;

import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;
import java.util.List;
import java.util.Map;

/**
 * Created by steve on 10/14/15.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = UserFormServiceImplTestContextConfiguration.class, loader = AnnotationConfigContextLoader.class)
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
    public void testJson() throws Exception{
        WorkFlow workFlow = workFlowService.get("402880915076f662015076f82cf30000");
        for(WorkFlowNode workFlowNode:workFlow.getNodes()){
            
        }
        ObjectMapper mapper = new ObjectMapper();
        StringWriter writer = new StringWriter();
        try {
            mapper.writeValue(writer,workFlow);
//            mapper.
        } catch (IOException e) {
            e.printStackTrace();
        }
        System.out.println(writer.toString());
    }

    //@Test
    public void testGet() throws Exception {
        WorkFlow workFlow = workFlowService.get("402880915076f662015076f82cf30000");
        System.out.println(workFlow.getConnections().size());
        System.out.println(workFlow.getNodes().size());

        for(WorkFlowNode workFlowNode:workFlow.getNodes()){
            System.out.println(workFlowNode.getId());
            System.out.println(workFlowNode.getElementName());
            System.out.println(workFlowNode.getNodeType());
            Map<String,WorkFlowNode> nexts = workFlowNode.getNexts();
            System.out.println("================================");
            for(String key:nexts.keySet()){
                System.out.println("key:");
                System.out.println(key);
                System.out.println("next");
                System.out.println(nexts.get(key));

            }

        }
//        WorkFlow workFlow = workFlowService.get("4028809150695a820150695a89a30000");
        WorkFlowGenerator workFlowGenerator = new WorkFlowGenerator();
        WorkFlow wf = workFlowGenerator.createWorkFlow("{  \n" +
                "   \"connections\":[  \n" +
                "      {  \n" +
                "         \"ConnectionId\":\"con_10\",\n" +
                "         \"PageSourceId\":\"state_start1\",\n" +
                "         \"PageTargetId\":\"state_question2\",\n" +
                "         \"SourceText\":\"Start\",\n" +
                "         \"TargetText\":\"d\",\n" +
                "         \"SourceAnchor\":\"BottomCenter\",\n" +
                "         \"TargetAnchor\":\"TopCenter\",\n" +
                "         \"ConnectText\":null,\n" +
                "         \"ConnectionType\":\"defaultConnection\"\n" +
                "      },\n" +
                "      {  \n" +
                "         \"ConnectionId\":\"con_16\",\n" +
                "         \"PageSourceId\":\"state_question2\",\n" +
                "         \"PageTargetId\":\"state_end3\",\n" +
                "         \"SourceText\":\"d\",\n" +
                "         \"TargetText\":\"End\",\n" +
                "         \"SourceAnchor\":\"Assign\",\n" +
                "         \"TargetAnchor\":\"TopCenter\",\n" +
                "         \"ConnectText\":\"w\",\n" +
                "         \"ConnectionType\":\"defaultConnection\"\n" +
                "      }\n" +
                "   ],\n" +
                "   \"nodes\":[  \n" +
                "      {  \n" +
                "         \"BlockId\":\"state_start1\",\n" +
                "         \"BlockContent\":\"Start\",\n" +
                "         \"BlockX\":64,\n" +
                "         \"BlockY\":74,\n" +
                "         \"Node_Type\":\"StartNode\",\n" +
                "         \"Node_Data\":{  \n" +
                "            \"element_data\":{  \n" +
                "\n" +
                "            },\n" +
                "            \"next\":[  \n" +
                "               {  \n" +
                "                  \"tiaojian\":\"default\",\n" +
                "                  \"next\":\"state_question2\"\n" +
                "               }\n" +
                "            ]\n" +
                "         }\n" +
                "      },\n" +
                "      {  \n" +
                "         \"BlockId\":\"state_question2\",\n" +
                "         \"BlockContent\":\"d\",\n" +
                "         \"BlockX\":112,\n" +
                "         \"BlockY\":259,\n" +
                "         \"Node_Type\":\"QuestionNode\",\n" +
                "         \"Node_Data\":{  \n" +
                "            \"element_data\":{  \n" +
                "               \"question_name\":\"d\"\n" +
                "            },\n" +
                "            \"next\":[  \n" +
                "               {  \n" +
                "                  \"tiaojian\":\"default\",\n" +
                "                  \"next\":\"state_end3\"\n" +
                "               }\n" +
                "            ]\n" +
                "         }\n" +
                "      },\n" +
                "      {  \n" +
                "         \"BlockId\":\"state_end3\",\n" +
                "         \"BlockContent\":\"End\",\n" +
                "         \"BlockX\":429,\n" +
                "         \"BlockY\":272,\n" +
                "         \"Node_Type\":\"EndNode\",\n" +
                "         \"Node_Data\":{  \n" +
                "            \"element_data\":{  \n" +
                "\n" +
                "            },\n" +
                "            \"next\":{  \n" +
                "\n" +
                "            }\n" +
                "         }\n" +
                "      }\n" +
                "   ],\n" +
                "   \"id\":\"\",\n" +
                "   \"workflowname\":\"ww\",\n" +
                "   \"workflow_desc\":\"\",\n" +
                "   \"creator\":\"\",\n" +
                "   \"create_time\":\"\",\n" +
                "   \"update_time\":\"\"\n" +
                "}");
//                workFlowService.save(wf);
    }

   // @Test
    public void testLoad() throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        String s= ("{  \n" +
                "   \"connections\":[  \n" +
                "      {  \n" +
                "         \"id\":\"\",\n" +
                "         \"dispalyName\":null,\n" +
                "         \"connectionType\":\"defaultConnection\",\n" +
                "         \"diagramId\":\"con_14\",\n" +
                "         \"successValue\":null,\n" +
                "         \"PageSourceId\":\"state_start1\",\n" +
                "         \"PageTargetId\":\"state_question3\"\n" +
                "      },\n" +
                "      {  \n" +
                "         \"id\":\"\",\n" +
                "         \"dispalyName\":\"dd\",\n" +
                "         \"connectionType\":\"defaultConnection\",\n" +
                "         \"diagramId\":\"con_20\",\n" +
                "         \"successValue\":\"dd\",\n" +
                "         \"PageSourceId\":\"state_question3\",\n" +
                "         \"PageTargetId\":\"state_end4\"\n" +
                "      }\n" +
                "   ],\n" +
                "   \"nodes\":[  \n" +
                "      {  \n" +
                "         \"id\":\"\",\n" +
                "         \"displayName\":\"Start\",\n" +
                "         \"diagramId\":\"state_start1\",\n" +
                "         \"position_top\":125,\n" +
                "         \"position_left\":15,\n" +
                "         \"nodeType\":\"StartNode\",\n" +
                "         \"Node_Data\":{  \n" +
                "            \"element_data\":{  \n" +
                "\n" +
                "            },\n" +
                "            \"next\":[  \n" +
                "               {  \n" +
                "                  \"tiaojian\":\"default\",\n" +
                "                  \"next\":\"state_question3\"\n" +
                "               }\n" +
                "            ]\n" +
                "         }\n" +
                "      },\n" +
                "      {  \n" +
                "         \"id\":\"\",\n" +
                "         \"displayName\":\"sdda\",\n" +
                "         \"diagramId\":\"state_question3\",\n" +
                "         \"position_top\":232,\n" +
                "         \"position_left\":395,\n" +
                "         \"nodeType\":\"QuestionNode\",\n" +
                "         \"Node_Data\":{  \n" +
                "            \"element_data\":{  \n" +
                "               \"question_name\":\"sdda\"\n" +
                "            },\n" +
                "            \"next\":[  \n" +
                "               {  \n" +
                "                  \"tiaojian\":\"default\",\n" +
                "                  \"next\":\"state_end4\"\n" +
                "               }\n" +
                "            ]\n" +
                "         }\n" +
                "      },\n" +
                "      {  \n" +
                "         \"id\":\"\",\n" +
                "         \"displayName\":\"End\",\n" +
                "         \"diagramId\":\"state_end4\",\n" +
                "         \"position_top\":374,\n" +
                "         \"position_left\":122,\n" +
                "         \"nodeType\":\"EndNode\",\n" +
                "         \"Node_Data\":{  \n" +
                "            \"element_data\":{  \n" +
                "\n" +
                "            },\n" +
                "            \"next\":{  \n" +
                "\n" +
                "            }\n" +
                "         }\n" +
                "      }\n" +
                "   ],\n" +
                "   \"id\":\"\",\n" +
                "   \"workflowname\":\"d\",\n" +
                "   \"workflow_desc\":\"\",\n" +
                "   \"creator\":\"\",\n" +
                "   \"create_time\":\"\",\n" +
                "   \"update_time\":\"\"\n" +
                "}");
        WorkFlow workFlow = new WorkFlowGenerator().createWorkFlow(s);

        StringWriter stringWriter = new StringWriter();
        mapper.writeValue(stringWriter,workFlow);
        System.out.println(stringWriter.toString());

//        WorkFlow workFlow = workFlowService.get("40288091506cfc0c01506cfc13410000");
//        StringWriter stringWriter = new StringWriter();
//        mapper.writeValue(stringWriter,workFlow);
//        System.out.println(stringWriter.toString());
    }

    @Test
    public void testLoadAll() throws Exception {
//        List<WorkFlow> list = workFlowService.loadAll();
//        for(WorkFlow wf: list){
//            workFlowService.delete(wf);
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