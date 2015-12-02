/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.model.forms;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

/**
 * Created by steve on 11/21/15.
 */
@Entity
public class CustomizedElementField implements Cloneable{
    @Id
    @GeneratedValue(generator = "idGenerator")
    @GenericGenerator(name = "idGenerator", strategy = "uuid")
    @Column(name = "id", nullable = false)
    private String id;
    private String name;
    @Lob
    @Column(columnDefinition = "BLOB")
    private String description;
    private CustomizedElementFieldType type;

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

    public CustomizedElementFieldType getType() {
        return type;
    }

    public void setType(CustomizedElementFieldType type) {
        this.type = type;
    }
    enum CustomizedElementFieldType {
        String, Number, Date
    }

    public CustomizedElementField clone() throws CloneNotSupportedException {
        CustomizedElementField p;
        p = (CustomizedElementField) super.clone();
        return p;
    }
}
