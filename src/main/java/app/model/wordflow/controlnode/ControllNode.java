/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.model.wordflow.controlnode;

import app.model.wordflow.WorkFlowNodeElement;

import javax.persistence.*;

/**
 * Created by steve on 10/14/15.
 */

@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@Table(name = "controllnode")
public abstract class ControllNode implements WorkFlowNodeElement {
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    private int id;

    private String name;

    private String nodeType;

    @Override
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public String getNodeType() {
        return this.nodeType;
    }

    public void setNodeType(String nodeType){
        this.nodeType = nodeType;
    }

    public void setName(String name) {
        this.name = name;
    }
}
