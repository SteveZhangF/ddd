/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.model.wordflow;

import java.util.HashMap;

/**
 * Created by steve on 10/13/15.
 */
public class BranchNode extends WorkFlowNode {

    private HashMap<String,WorkFlowNode> processtoBranch = new HashMap<>();

    public HashMap<String, WorkFlowNode> getProcesstoBranch() {
        return processtoBranch;
    }

    public void setProcesstoBranch(HashMap<String, WorkFlowNode> processtoBranch) {
        this.processtoBranch = processtoBranch;
    }
}
