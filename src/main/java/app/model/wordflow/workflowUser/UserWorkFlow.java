/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.model.wordflow.workflowUser;

import app.model.wordflow.WorkFlow;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by steve on 10/15/15.
 */
@Table
@Entity
public class UserWorkFlow {
    @OneToMany(cascade ={ CascadeType.ALL},orphanRemoval=true)
    @Cascade({org.hibernate.annotations.CascadeType.REMOVE})
    @LazyCollection(LazyCollectionOption.FALSE)
    private List<Node> nodes = new ArrayList<>();
    @Id
    @GeneratedValue
    private int id;
    private String name;

    @OneToOne
    private WorkFlow workFlow;

    public List<Node> getNodes() {
        return nodes;
    }

    public void setNodes(List<Node> nodes) {
        this.nodes = nodes;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public WorkFlow getWorkFlow() {
        return workFlow;
    }

    public void setWorkFlow(WorkFlow workFlow) {
        this.workFlow = workFlow;
    }

    public void addNode(Node node) {
        this.nodes.add(node);
    }

    public void clear() {
        this.nodes.clear();
    }
}
