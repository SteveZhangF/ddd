package app.model.wordflow;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by steve on 10/9/15.
 */

//"61": {
//"top": 132,
//        "left": 193,
//        "process_to": [
//        "63",
//        "64"
//        ]
//        },
public class WorkFlowNode {
    private WorkFlowNodeElement element;
    private int id;
    private int top;
    private int left;
    private List<WorkFlowNode> process_to = new ArrayList<WorkFlowNode>();


    public WorkFlowNodeElement getElement() {
        return element;
    }

    public void setElement(WorkFlowNodeElement element) {
        this.element = element;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getTop() {
        return top;
    }

    public void setTop(int top) {
        this.top = top;
    }

    public int getLeft() {
        return left;
    }

    public void setLeft(int left) {
        this.left = left;
    }

    public List<WorkFlowNode> getProcess_to() {
        return process_to;
    }

    public void setProcess_to(List<WorkFlowNode> process_to) {
        this.process_to = process_to;
    }
}
