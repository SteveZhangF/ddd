package app.model.wordflow;

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

    private WorkFlowNode processto;

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


    public WorkFlowNode getProcessto() {
        return processto;
    }

    public void setProcessto(WorkFlowNode processto) {
        this.processto = processto;
    }

}
