/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.helper;

import app.model.wordflow.ConnectionType;
import app.model.wordflow.WorkFlow;
import app.model.wordflow.WorkFlowConnection;
import app.model.wordflow.WorkFlowNode;
import app.model.wordflow.controlnode.EndWorkFlowNodeElement;
import app.model.wordflow.controlnode.NodeType;
import app.model.wordflow.controlnode.QuestionWorkFlowNodeElement;
import app.model.wordflow.controlnode.StartWorkFlowNodeElement;
import app.model.wordflow.workflowUser.Graph;
import app.model.wordflow.workflowUser.Node;
import app.model.wordflow.workflowUser.UserWorkFlow;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by steve on 10/15/15.
 */
public class WorkFlowGenerator {
    private WorkFlow workFlow;


    public WorkFlow createWorkFlow(String json) throws IOException {
        WorkFlow workFlow = new WorkFlow();
        ObjectMapper mapper = new ObjectMapper();
        JsonNode rootNode = mapper.readTree(json); // 读取Json

        workFlow.setDisplayName(rootNode.get("displayName").asText());
        workFlow.setWorkFlow_Description(rootNode.get("workFlow_Description").asText());
        workFlow.setCreator(rootNode.get("creator").asText());
        workFlow.setId(rootNode.get("id").asText());

        JsonNode nodes = rootNode.path("nodes");
        JsonNode conns = rootNode.path("connections");


        //{
//        "id":"",
//                "displayName":"sdda",
//                "diagramId":"state_question3",
//                "position_top":232,
//                "position_left":395,
//                "nodeType":"QuestionNode",
//                "Node_Data":{
//            "element_data":{
//                "question_name":"sdda"
//            },
//            "next":[
//            {
//                "tiaojian":"default",
//                    "next":"state_end4"
//            }
//            ]
//        }

        for (JsonNode node : nodes) {
            WorkFlowNode workFlowNode = new WorkFlowNode();
            String diagramID = node.get("diagramId").asText();
            String displayName = node.get("displayName").asText();
            int left = node.get("position_left").asInt();
            int top = node.get("position_top").asInt();

            workFlowNode.setDiagramId(diagramID);
            workFlowNode.setDisplayName(displayName);
            workFlowNode.setPosition_left(left);
            workFlowNode.setPosition_top(top);
            String node_type = node.get("nodeType").asText();
            if (node_type.equals(NodeType.StartNode.getValue())) {
                StartWorkFlowNodeElement startWorkFlowNodeElement = new StartWorkFlowNodeElement();

                workFlowNode.setWorkFlowNodeElement(startWorkFlowNodeElement);
            } else if (node_type.equals(NodeType.EndNode.getValue())) {
                EndWorkFlowNodeElement endWorkFlowNodeElement = new EndWorkFlowNodeElement();
                workFlowNode.setWorkFlowNodeElement(endWorkFlowNodeElement);
            } else if (node_type.equals(NodeType.QuestionNode.getValue())) {
                QuestionWorkFlowNodeElement questionWorkFlowNodeElement = new QuestionWorkFlowNodeElement();
                JsonNode data = node.get("Node_Data").get("element_data");
                questionWorkFlowNodeElement.setName(data.get("question_name").asText());
                workFlowNode.setWorkFlowNodeElement(questionWorkFlowNodeElement);
            } else if (node_type.equals(NodeType.FormNode.getValue())) {
                JsonNode data = node.get("Node_Data").get("element_data");
                workFlowNode.setElementId(data.get("id").asInt());
                workFlowNode.setElementName(data.get("name").asText());
                workFlowNode.setNodeType(NodeType.FormNode.getValue());
            }
            workFlow.addNode(workFlowNode);
        }

        int now = 0;
        for(JsonNode node:nodes){
            JsonNode nextsIndiagram = node.get("Node_Data").path("next");
            for(JsonNode nextIndiagram : nextsIndiagram){
                String tiaojian = nextIndiagram.get("tiaojian").asText();
                String next = nextIndiagram.get("next").asText();
                for(WorkFlowNode workFlowNode:workFlow.getNodes()){
                    if(workFlowNode.getDiagramId().equals(next)){
                        workFlow.getNodes().get(now).getNexts().put(tiaojian,workFlowNode);
                    }
                }
            }
            now++;
        }

        /**
         *
         *
         * {
         "id":"",
         "dispalyName":"ww",
         "connectionType":"defaultConnection",
         "diagramId":"con_16",
         "successValue":"ww",
         "PageSourceId":"state_question2",
         "PageTargetId":"state_end3"
         }
         * */
        for (JsonNode conn : conns) {
            WorkFlowConnection workFlowConnection = new WorkFlowConnection();
            String diagramId = conn.get("diagramId").asText();
            String PageSourceId = conn.get("PageSourceId").asText();
            String PageTargetId = conn.get("PageTargetId").asText();
            String ConnectionTypez = conn.get("connectionType").asText();
            String ConnectText = conn.get("dispalyName").asText();
            workFlowConnection.setConnectionType(ConnectionTypez);
            workFlowConnection.setDiagramId(diagramId);
            for (WorkFlowNode workFlowNode : workFlow.getNodes()) {
                if (workFlowNode.getDiagramId().equals(PageSourceId)) {
                    workFlowConnection.setSource(workFlowNode);
                } else if (workFlowNode.getDiagramId().equals(PageTargetId)) {
                    workFlowConnection.setTarget(workFlowNode);
                }
            }
            if (ConnectionTypez.equals(ConnectionType.QuestionConnection.getValue())) {
                workFlowConnection.setSuccessValue(ConnectText);
            }
            workFlow.addConnection(workFlowConnection);
        }
        return workFlow;
    }

}
