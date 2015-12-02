/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.model.forms;

import app.model.common.CommonField;
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


    @OneToMany(cascade = CascadeType.ALL)
    @LazyCollection(LazyCollectionOption.FALSE)
    @Cascade(org.hibernate.annotations.CascadeType.REMOVE)
    private List<CustomizedElementField> fields = new ArrayList<>();


    public List<CustomizedElementField> getFields() {
        return fields;
    }

    public void setFields(List<CustomizedElementField> fields) {
        this.fields = fields;
    }


    public CustomizedElement clone() throws CloneNotSupportedException {
        CustomizedElement p;
        p = (CustomizedElement) super.clone();
        List<CustomizedElementField> options = new ArrayList<>();
        for(CustomizedElementField option: this.getFields()){
            CustomizedElementField op = option.clone();
            op.setId(null);
            options.add(op);
        }
        p.setFields(options);
        return p;
    }

}
