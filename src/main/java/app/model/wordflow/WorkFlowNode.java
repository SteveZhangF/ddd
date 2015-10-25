/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.model.wordflow;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by steve on 10/24/15.
 */
@Table
@Entity
public class WorkFlowNode {

    public WorkFlowNode(Data data,List<Next> nexts){
        this.data = data;
        this.nexts = nexts;
    }

    public WorkFlowNode(){}

    @Id
    @GeneratedValue(generator = "idGenerator")
    @GenericGenerator(name = "idGenerator", strategy = "uuid")
    private  String id;
//    function node(id, name, type, data, x, y) {
//        this.id = id;
//        this.name = name;
//        this.type = type;
//        this.data = data;
//        this.x = x;
//        this.y = y;
//        this.nexts = [];
//        this.prev = '';
//    }

    private String name;
    private String type;
    private String x;
    private String y;

    @OneToOne(cascade = CascadeType.ALL)
    private Data data = new Data();

    @OneToMany(cascade = CascadeType.ALL)
    @LazyCollection(LazyCollectionOption.FALSE)
    private List<Next> nexts = new ArrayList<>();

    private String prev;

    public String getPrev() {
        return prev;
    }

    public void setPrev(String prev) {
        this.prev = prev;
    }

    public List<Next> getNexts() {
        return nexts;
    }

    public void setNexts(List<Next> nexts) {
        this.nexts = nexts;
    }

    public Data getData() {
        return data;
    }

    public void setData(Data data) {
        this.data = data;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getX() {
        return x;
    }

    public void setX(String x) {
        this.x = x;
    }

    public String getY() {
        return y;
    }

    public void setY(String y) {
        this.y = y;
    }
}
