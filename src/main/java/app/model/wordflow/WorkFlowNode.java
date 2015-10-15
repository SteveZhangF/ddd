package app.model.wordflow;

import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

/**
 * Created by steve on 10/9/15.
 */

@Entity
@Table(name = "workflownodes")
public class WorkFlowNode extends WorkFlowElement {

    private int position_top;
    private int position_left;
    private String nodeType;

    private String elementName;
    private int elementId;

    @OneToMany( cascade = {CascadeType.ALL}, orphanRemoval = true)
    @Cascade({org.hibernate.annotations.CascadeType.REMOVE})
    @LazyCollection(LazyCollectionOption.FALSE)
    public Set<WorkFlowConnection> out_connections = new HashSet<>();

    @OneToMany( cascade = {CascadeType.ALL}, orphanRemoval = true)
    @Cascade({org.hibernate.annotations.CascadeType.REMOVE})
    @LazyCollection(LazyCollectionOption.FALSE)
    public Set<WorkFlowConnection> in_connections = new HashSet<>();

    public WorkFlow getWorkflow_node() {
        return workflow_node;
    }

    public void setWorkflow_node(WorkFlow workflow_node) {
        this.workflow_node = workflow_node;
    }

    @ManyToOne
//    @JoinColumn(name = "workflow_node_id")
    private WorkFlow workflow_node;

    public String getElementName() {
        return elementName;
    }

    public void setElementName(String elementName) {
        this.elementName = elementName;
    }

    public int getElementId() {
        return elementId;
    }

    public void setElementId(int elementId) {
        this.elementId = elementId;
    }


    public String getNodeType() {
        return nodeType;
    }

    public void setNodeType(String nodeType) {
        this.nodeType = nodeType;
    }

    public int getPosition_top() {
        return position_top;
    }

    public void setPosition_top(int position_top) {
        this.position_top = position_top;
    }

    public int getPosition_left() {
        return position_left;
    }

    public void setPosition_left(int position_left) {
        this.position_left = position_left;
    }

    public void setWorkFlowNodeElement(WorkFlowNodeElement element) {
        this.setElementId(element.getId());
        this.setElementName(element.getName());
        this.setNodeType(element.getNodeType());
    }

    public Set<WorkFlowConnection> getIn_connections() {
        return in_connections;
    }

    public void setIn_connections(Set<WorkFlowConnection> in_connections) {
        this.in_connections = in_connections;
    }

    public Set<WorkFlowConnection> getOut_connections() {
        return out_connections;
    }

    public void setOut_connections(Set<WorkFlowConnection> out_connections) {
        this.out_connections = out_connections;
    }

}
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