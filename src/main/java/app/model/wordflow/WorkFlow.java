package app.model.wordflow;

import org.hibernate.annotations.*;

import javax.persistence.*;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by steve on 10/9/15.
 */

//{
//        "connections": [
//        ],
//        "nodes": [
//        ],
//        "id": "", 1
//        "workflowname": "", 1
//        "workflow_desc": "", 1
//        "creator": "", 1
//        "create_time": "", 1
//        "update_time": "" 1
//        }
@Entity
@Table(name = "workflow")
public class WorkFlow {
    @Id
    @GeneratedValue(generator = "idGenerator")
    @GenericGenerator(name = "idGenerator", strategy = "uuid")
    private String id;
    private String description;
    private String name;

    @OneToMany(cascade = CascadeType.ALL)
    @Cascade(org.hibernate.annotations.CascadeType.REMOVE)
    @LazyCollection(LazyCollectionOption.FALSE)
    private List<WorkFlowNode> nodes = new ArrayList<>();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<WorkFlowNode> getNodes() {
        return nodes;
    }

    public void setNodes(List<WorkFlowNode> nodes) {
        this.nodes = nodes;
    }
}
