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
 * Created by steve on 11/22/15.
 */
@Entity
@Table
public class CustomizedElementRecordValue {
    @Id
    @GeneratedValue(generator = "idGenerator")
    @GenericGenerator(name = "idGenerator", strategy = "uuid")
    @Column(name = "id", nullable = false)
    private String id;
    @ManyToOne
    private CustomizedElementField customizedElementField;
    @Lob
    @Column(columnDefinition = "BLOB")
    private String value;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public CustomizedElementField getCustomizedElementField() {
        return customizedElementField;
    }

    public void setCustomizedElementField(CustomizedElementField customizedElementField) {
        this.customizedElementField = customizedElementField;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
