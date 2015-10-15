/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.model.wordflow.controlnode;

import app.model.wordflow.WorkFlowNodeElement;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * Created by steve on 10/14/15.
 */
@Entity
@Table(name="endworkflownode")
public class EndWorkFlowNodeElement extends ControllNode implements WorkFlowNodeElement {
    public EndWorkFlowNodeElement(){
        this.setNodeType(NodeType.EndNode.getValue());
    }
}

