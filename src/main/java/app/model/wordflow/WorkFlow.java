package app.model.wordflow;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.sql.Date;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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
public class WorkFlow extends WorkFlowElement {
    private String creator;
    private String workFlow_Description;
    private Date create_time;
    private Date update_time;

    @OneToMany(cascade ={ CascadeType.ALL},orphanRemoval=true)
    @Cascade({org.hibernate.annotations.CascadeType.REMOVE})
    @LazyCollection(LazyCollectionOption.FALSE)
    private Set<WorkFlowConnection> connections = new HashSet<>();

    @OneToMany(cascade = {CascadeType.ALL},orphanRemoval = true)
    @Cascade({org.hibernate.annotations.CascadeType.REMOVE})
    @LazyCollection(LazyCollectionOption.FALSE)
    private Set<WorkFlowNode> nodes = new HashSet<>();

    public void addNode(WorkFlowNode node){
        this.nodes.add(node);
    }

    public void removeNode(WorkFlowNode node){
        this.nodes.remove(node);

    }

    public void clearNodes(){
        this.nodes.clear();
    }

    public void addConnection(WorkFlowConnection connection){
        this.connections.add(connection);
    }

    public void removeConnection(WorkFlowConnection connection){
        this.connections.remove(connection);
    }

    public void clearConnections(){
        this.connections.clear();
    }

    public Set<WorkFlowConnection> getConnections() {
        return connections;
    }

    public void setConnections(Set<WorkFlowConnection> connections) {
        this.connections = connections;
    }

    public Set<WorkFlowNode> getNodes() {
        return nodes;
    }

    public void setNodes(Set<WorkFlowNode> nodes) {
        this.nodes = nodes;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public String getWorkFlow_Description() {
        return workFlow_Description;
    }

    public void setWorkFlow_Description(String workFlow_Description) {
        this.workFlow_Description = workFlow_Description;
    }

    public Date getCreate_time() {
        return create_time;
    }

    public void setCreate_time(Date create_time) {
        this.create_time = create_time;
    }

    public Date getUpdate_time() {
        return update_time;
    }

    public void setUpdate_time(Date update_time) {
        this.update_time = update_time;
    }

}
