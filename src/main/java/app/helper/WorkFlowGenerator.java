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
import java.util.Map;

/**
 * Created by steve on 10/15/15.
 */
public class WorkFlowGenerator {
    private WorkFlow workFlow;

    public WorkFlow createWorkFlow(String json) throws IOException {
        WorkFlow workFlow = new WorkFlow();
        ObjectMapper mapper = new ObjectMapper();
        JsonNode rootNode = mapper.readTree(json); // 读取Json

        workFlow.setDisplayName(rootNode.get("workflowname").asText());
        workFlow.setWorkFlow_Description(rootNode.get("workflow_desc").asText());
        workFlow.setCreator(rootNode.get("creator").asText());
        workFlow.setId(rootNode.get("id").asText());

        JsonNode nodes = rootNode.path("nodes");
        JsonNode conns = rootNode.path("connections");
        for (JsonNode node : nodes) {
            WorkFlowNode workFlowNode = new WorkFlowNode();
            String diagramID = node.get("BlockId").asText();
            String displayName = node.get("BlockContent").asText();
            int left = node.get("BlockX").asInt();
            int top = node.get("BlockY").asInt();

            workFlowNode.setDiagramId(diagramID);
            workFlowNode.setDisplayName(displayName);
            workFlowNode.setPosition_left(left);
            workFlowNode.setPosition_top(top);
            String node_type = node.get("Node_Type").asText();
            if (node_type.equals(NodeType.StartNode.getValue())) {
                StartWorkFlowNodeElement startWorkFlowNodeElement = new StartWorkFlowNodeElement();
                workFlowNode.setWorkFlowNodeElement(startWorkFlowNodeElement);
            } else if (node_type.equals(NodeType.EndNode.getValue())) {
                EndWorkFlowNodeElement endWorkFlowNodeElement = new EndWorkFlowNodeElement();
                workFlowNode.setWorkFlowNodeElement(endWorkFlowNodeElement);
            } else if (node_type.equals(NodeType.QuestionNode.getValue())) {
                //TODO save question node
                QuestionWorkFlowNodeElement questionWorkFlowNodeElement = new QuestionWorkFlowNodeElement();
                workFlowNode.setWorkFlowNodeElement(questionWorkFlowNodeElement);
            } else if (node_type.equals(NodeType.FormNode.getValue())) {
                JsonNode data = node.get("Node_Data");
                workFlowNode.setElementId(data.get("id").asInt());
                workFlowNode.setElementName(data.get("name").asText());
                workFlowNode.setNodeType(NodeType.FormNode.getValue());
            }
            workFlow.addNode(workFlowNode);
        }
        for (JsonNode conn : conns) {
            WorkFlowConnection workFlowConnection = new WorkFlowConnection();
            String diagramId = conn.get("ConnectionId").asText();
            String PageSourceId = conn.get("PageSourceId").asText();
            String PageTargetId = conn.get("PageTargetId").asText();
            String ConnectionTypez = conn.get("ConnectionType").asText();
            String ConnectText = conn.get("ConnectText").asText();
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


    public UserWorkFlow generatorUserWorkFlow(WorkFlow workFlow) {
        UserWorkFlow userWorkFlow = new UserWorkFlow();

        Graph<WorkFlowNode> graph = new Graph<>(workFlow.getNodes().size());
        List<WorkFlowNode> nodelist = new ArrayList<>();
        for (WorkFlowNode wfn : workFlow.getNodes()) {
            graph.insertVertex(wfn);
            nodelist.add(wfn);
        }
        for (WorkFlowConnection wfc : workFlow.getConnections()) {
            int j = 0;
            int si = 0;
            int ti = 0;
            for (WorkFlowNode wfn : nodelist) {
                if (wfn.getId().equals(wfc.getSource().getId())) {
                    si = j;
                }
                if (wfn.getId().equals(wfc.getTarget().getId())) {
                    ti = j;
                }
                j++;
            }
            if(wfc.getConnectionType().equals(ConnectionType.QuestionConnection.getValue())){

            }
            graph.insertEdge(si, ti, 1);
        }

        ArrayList<Node> list = new ArrayList<>();
        for (int j = 0; j < nodelist.size(); j++) {
            int next_index = -1;
            Node node = new Node();
            node.setElementName(nodelist.get(j).getElementName());
            node.setElementId(nodelist.get(j).getElementId());
            node.setNodeType(nodelist.get(j).getNodeType());
            boolean firstnext = true;
            while (next_index != 0) {
                if (firstnext) {
                    next_index = graph.getFirstNeighbor(j);
                    if (next_index == -1) break;
                    firstnext = false;
                } else {
                    next_index = graph.getNextNeighbor(j, next_index);
                    if (next_index == -1) break;
                }
                node.getNextIndex().add(next_index);
            }
            list.add(node);
        }

        for (Node node : list) {
            for (Integer next : node.getNextIndex()) {
                node.getNextList().add(list.get(next));
                list.get(next).setPrev(node);
            }
            userWorkFlow.addNode(node);
        }
        return userWorkFlow;
    }
}
