/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.model.forms;

import app.model.files.FileElement;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by steve on 11/21/15.
 */
@Entity
@Table
public class CustomizedElement extends FileElement {

    public CustomizedElement() {
        setLeaf(true);
        setRoot(false);
        setType(FileType.CUSTOMIZED_ELEMENT);
    }

    public CustomizedElement(List<CustomizedElementField> fields) {
        this();
        this.fields = fields;
    }

//    @Id
//    @GeneratedValue(generator = "idGenerator")
//    @GenericGenerator(name = "idGenerator", strategy = "uuid")
//    @Column(name = "id", nullable = false)
//    private String id;
//    private String name;
//    @Lob
//    @Column(columnDefinition = "BLOB")
//    private String description;
//    private Timestamp createTime;
//    private Timestamp updateTime;

    @OneToMany(cascade = CascadeType.ALL)
    @LazyCollection(LazyCollectionOption.FALSE)
    @Cascade(org.hibernate.annotations.CascadeType.REMOVE)
    private List<CustomizedElementField> fields = new ArrayList<>();

//    public String getId() {
//        return id;
//    }
//
//    public void setId(String id) {
//        this.id = id;
//    }

    public List<CustomizedElementField> getFields() {
        return fields;
    }

    public void setFields(List<CustomizedElementField> fields) {
        this.fields = fields;
    }

//    public Timestamp getUpdateTime() {
//        return updateTime;
//    }
//
//    public void setUpdateTime(Timestamp updateTime) {
//        this.updateTime = updateTime;
//    }
//
//    public Timestamp getCreateTime() {
//        return createTime;
//    }
//
//    public void setCreateTime(Timestamp createTime) {
//        this.createTime = createTime;
//    }
//
//    public String getDescription() {
//        return description;
//    }
//
//    public void setDescription(String description) {
//        this.description = description;
//    }
//
//    public String getName() {
//        return name;
//    }
//
//    public void setName(String name) {
//        this.name = name;
//    }


}
