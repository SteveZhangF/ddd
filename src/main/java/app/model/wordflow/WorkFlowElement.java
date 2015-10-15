/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.model.wordflow;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

/**
 * Created by steve on 10/14/15.
 */

//{
//        "connections": [
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
//        ],
//        "nodes": [
//        {
//        "BlockId": "state_start1",
//        "BlockContent": "Start",
//        "BlockX": 231,
//        "BlockY": 93,
//        "Node_Type": "state_start"
//        },
//        {
//        "BlockId": "state_question2",
//        "BlockContent": "ddwqa",
//        "BlockX": 228,
//        "BlockY": 282,
//        "Node_Type": "state_question",
//        "Node_Data": "{\"question_name\":\"ddwqa\"}"
//        },
//        {
//        "BlockId": "state_flow3",
//        "BlockContent": "
//        label 2
//        ",
//        "BlockX": 483,
//        "BlockY": 286,
//        "Node_Type": "state_flow",
//        "Node_Data": "{\"id\":2,\"type\":\"form\",\"name\":\"form2\"}"
//        },
//        {
//        "BlockId": "state_end4",
//        "BlockContent": "End",
//        "BlockX": 642,
//        "BlockY": 266,
//        "Node_Type": "state-end"
//        }
//        ],
//        "id": "",
//        "workflowname": "",
//        "workflow_desc": "",
//        "creator": "",
//        "create_time": "",
//        "update_time": ""
//        }
@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@Table(name = "workflowelement")
public abstract class WorkFlowElement {
    @Id
    @GeneratedValue(generator = "idGenerator")
    @GenericGenerator(name = "idGenerator", strategy = "uuid")
    @Column(name = "id", nullable = false)
    private String id;
    private String displayName;
    private String diagramId;

    public String getId() {
        return id;
    }

    public void setId(String  id) {
        this.id = id;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getDiagramId() {
        return diagramId;
    }

    public void setDiagramId(String diagramId) {
        this.diagramId = diagramId;
    }
}
