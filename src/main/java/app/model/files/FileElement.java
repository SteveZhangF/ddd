/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.model.files;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.sql.Timestamp;

/**
 * Created by steve on 11/23/15.
 */
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "file_element")
public abstract class FileElement implements Cloneable {

    @Id
    @GeneratedValue(generator = "idGenerator")
    @GenericGenerator(name = "idGenerator", strategy = "uuid")
    @Column(name = "id", nullable = false)
    private String id;
    private String name;
    @Lob
    @Column(columnDefinition = "BLOB")
    private String description;
    private Timestamp createTime;
    private Timestamp updateTime;
    private int level;
    private boolean leaf;
    private String parent_id;
    private boolean deleted;
    private boolean root;
    @Enumerated(EnumType.STRING)
    private FileType type;

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

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public boolean isLeaf() {
        return leaf;
    }

    public void setLeaf(boolean leaf) {
        this.leaf = leaf;
    }

    public String getParent_id() {
        return parent_id;
    }

    public void setParent_id(String parent_id) {
        this.parent_id = parent_id;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;

    }

    public boolean isRoot() {
        return root;
    }

    public void setRoot(boolean root) {
        this.root = root;
    }


    public FileType getType() {
        return type;
    }

    public void setType(FileType type) {
        this.type = type;
    }

    public enum FileType {
        FILE, FOLDER, QUESTION, CUSTOMIZED_ELEMENT, EMPLOYEE_FIELD, EMPLOYEE_REPORT

    }

    public FileElement clone() throws CloneNotSupportedException {
        FileElement p;
        p = (FileElement) super.clone();
        return p;
    }
}
