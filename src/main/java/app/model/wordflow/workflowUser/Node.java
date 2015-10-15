/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.model.wordflow.workflowUser;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by steve on 10/15/15.
 */
public class Node {
    private Node prev;
    private List<Integer> nextIndex = new ArrayList<>();
    private List<Node> nextList = new ArrayList<>();

    private String elementName;
    private int elementId;
    private String nodeType;

    public String getNodeType() {
        return nodeType;
    }

    public void setNodeType(String nodeType) {
        this.nodeType = nodeType;
    }

    public Node getPrev() {
        return prev;
    }

    public void setPrev(Node prev) {
        this.prev = prev;
    }

    public List<Integer> getNextIndex() {
        return nextIndex;
    }

    public void setNextIndex(List<Integer> nextIndex) {
        this.nextIndex = nextIndex;
    }

    public List<Node> getNextList() {
        return nextList;
    }

    public void setNextList(List<Node> nextList) {
        this.nextList = nextList;
    }

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
}
