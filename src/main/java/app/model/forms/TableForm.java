/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.model.forms;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.List;

/**
 * Created by steve on 11/12/15.
 */
@Table
@Entity
public class TableForm {
//    {
//        "name":"tableFormTest", "description":"tableFormtest description",
// "fields":[{
//        "name":"field1", "type":"", "id":"1111"
//    },{
//        "id":0, "name":"field10", "type":""
//    },{
//        "id":1, "name":"field11", "type":""
//    },{
//        "id":2, "name":"field12", "type":""
//    },{
//        "id":3, "name":"field13", "type":""
//    },{
//        "id":4, "name":"field14", "type":""
//    }],"content":"", "tableRate":"Year", "recordRate":"Month"
//    }

    @Id
    @GeneratedValue(generator = "idGenerator")
    @GenericGenerator(name = "idGenerator", strategy = "uuid")
    @Column(name = "id", nullable = false)
    private String id;

    private String name;
    @Lob
    @Column(columnDefinition = "BLOB")
    private String description;
    @Lob
    @Column(columnDefinition = "BLOB")
    private String content;

    private String tableRate;
    private String recordRate;

    private Timestamp createTime;
    private Timestamp updateTime;


    @OneToMany
    @LazyCollection(LazyCollectionOption.FALSE)
    private List<TableFormField> fields;

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getTableRate() {
        return tableRate;
    }

    public void setTableRate(String tableRate) {
        this.tableRate = tableRate;
    }

    public String getRecordRate() {
        return recordRate;
    }

    public void setRecordRate(String recordRate) {
        this.recordRate = recordRate;
    }

    public List<TableFormField> getFields() {
        return fields;
    }

    public void setFields(List<TableFormField> fields) {
        this.fields = fields;
    }

    public Timestamp getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Timestamp createTime) {
        this.createTime = createTime;
    }

    public Timestamp getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Timestamp updateTime) {
        this.updateTime = updateTime;
    }
}
