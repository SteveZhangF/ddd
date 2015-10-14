package app.model.wordflow;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by steve on 10/9/15.
 */
public class WorkFlow extends WorkFlowNode {
    private List<WorkFlowNode> nodes = new ArrayList<>();

    public List<WorkFlowNode> getNodes() {
        return nodes;
    }

    public void setNodes(List<WorkFlowNode> nodes) {
        this.nodes = nodes;
    }

    public void add(WorkFlowNode workFlowNode){
        this.nodes.add(workFlowNode);
    }

    public void remove(WorkFlowNode workFlowNode){
        this.nodes.remove(workFlowNode);
    }

    public void clear(){
        this.nodes.clear();
    }
}
