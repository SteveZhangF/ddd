/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.model.wordflow;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cascade;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

/**
 * Created by steve on 10/14/15.
 */

//        {
//        "ConnectionId": "con_10",
//        "PageSourceId": "state_start1",
//        "PageTargetId": "state_question2",
//        "SourceText": "Start",
//        "TargetText": "ddwqa",
//        "SourceAnchor": "BottomCenter",
//        "TargetAnchor": "TopCenter",
//        "ConnectText": null,
//        "ConnectionType": "defaultConnection"
//        },
//        {
//        "ConnectionId": "con_18",
//        "PageSourceId": "state_question2",
//        "PageTargetId": "state_flow3",
//        "SourceText": "ddwqa",
//        "TargetText": "label 2",
//        "SourceAnchor": "Assign",
//        "TargetAnchor": "TopCenter",
//        "ConnectText": "1",
//        "ConnectionType": "questionConnection"
//        },
//        {
//        "ConnectionId": "con_25",
//        "PageSourceId": "state_flow3",
//        "PageTargetId": "state_end4",
//        "SourceText": "label 2",
//        "TargetText": "End",
//        "SourceAnchor": "BottomCenter",
//        "TargetAnchor": "TopCenter",
//        "ConnectText": null,
//        "ConnectionType": "defaultConnection"
//        }
    @Entity
    @Table(name = "workflowconnection")
public class WorkFlowConnection extends WorkFlowElement{

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "source_id")
    @Cascade({org.hibernate.annotations.CascadeType.SAVE_UPDATE})
    private WorkFlowNode source;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "target_id")
    @Cascade({org.hibernate.annotations.CascadeType.SAVE_UPDATE})
    private WorkFlowNode target;
    private String connectionType;
    private String successValue;

    private String PageSourceId;

    private String PageTargetId;

    @JsonIgnore
    @ManyToOne
    private WorkFlow workflow_connection;

    public WorkFlowNode getSource() {
        return source;
    }

    public void setSource(WorkFlowNode source) {
        this.source = source;
        this.setPageSourceId(source.getDiagramId());
    }

    public WorkFlowNode getTarget() {
        return target;
    }

    public void setTarget(WorkFlowNode target) {
        this.target = target;
        this.setPageTargetId(target.getDiagramId());
    }

    public String getConnectionType() {
        return connectionType;
    }

    public void setConnectionType(String connectionType) {
        this.connectionType = connectionType;
    }

    public String getSuccessValue() {
        return successValue;
    }

    public void setSuccessValue(String successValue) {
        this.successValue = successValue;
    }

    public WorkFlow getWorkflow_connection() {
        return workflow_connection;
    }

    public void setWorkflow_connection(WorkFlow workflow_connection) {
        this.workflow_connection = workflow_connection;
    }

    public String getPageTargetId() {
        return PageTargetId;
    }

    public void setPageTargetId(String pageTargetId) {
        PageTargetId = pageTargetId;
    }

    public String getPageSourceId() {
        return PageSourceId;
    }

    public void setPageSourceId(String pageSourceId) {
        PageSourceId = pageSourceId;
    }

}
