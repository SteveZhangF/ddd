/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.model.wordflow.controlnode;

/**
 * Created by steve on 10/14/15.
 */
public enum  NodeType {
    FormNode("FormNode"),StartNode("StartNode"),EndNode("EndNode"),QuestionNode("QuestionNode");


    private String value;
    private NodeType(String value){
        this.value = value;
    }

    public String getValue(){
        return this.value;
    }
}
