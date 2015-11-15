/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.model.userfield;

import app.model.forms.TableForm;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by steve on 11/13/15.
 */
@Table
@Entity
public class RecordConfig {
    //    {
//        "id":"", "default":{
//        "4028808550fef0dc0150fef1a5160000":"Saturday", "4028808550fef0dc0150fef1b3d60001":
//        "123", "4028808550fef0dc0150fef1c1060002":"asd", "4028808550fef0dc0150fef1c106000x":
//        "auto", "4028808550fef0dc0150fef1c10600zx":"auto"
//    },"tableForm":{
//        "id":"4028808550fef0dc0150fef212130003", "name":"neew", "description":"asd", "content":
//        "<h1 style=\"text-align: center;\">dasdasd</h1><table><thead><tr><th>date</th><th>people</th><th>text</th><th>week of month</th><th>month of year</th></tr></thead><tbody><tr><td id=\"4028808550fef0dc0150fef1a5160000\"><br></td><td id=\"4028808550fef0dc0150fef1b3d60001\"><br></td><td id=\"4028808550fef0dc0150fef1c1060002\"><br></td></td><td id=\"4028808550fef0dc0150fef1c106000x\"><br></td></td><td id=\"4028808550fef0dc0150fef1c10600zx\"><br></td></tr></tbody></table><br><br>", "tableRate":
//        "Month", "recordRate":"Day", "createTime":1447386289000, "updateTime":1447386289000, "fields":[{
//            "id":"4028808550fef0dc0150fef1a5160000", "name":"date", "type":"date"
//        },{
//            "id":"4028808550fef0dc0150fef1b3d60001", "name":"people", "type":"employee"
//        },{
//            "id":"4028808550fef0dc0150fef1c1060002", "name":"text", "type":"text"
//        },{
//            "id":"4028808550fef0dc0150fef1c106000x", "name":"week of month", "type":"week of month"
//        },{
//            "id":"4028808550fef0dc0150fef1c10600zx", "name":"month of year", "type":"month of year"
//        }]}
//    }
    @Id
    @GeneratedValue(generator = "idGenerator")
    @GenericGenerator(name = "idGenerator", strategy = "uuid")
    @Column(name = "id", nullable = false)
    private String id;
    @ManyToOne(fetch = FetchType.EAGER)
    private TableForm tableForm;

    @ElementCollection(fetch=FetchType.EAGER)
    @CollectionTable(name="recordConfig_defaultValues")
    @MapKeyColumn(name="field_id")
    @Column(name="default_value")
    private Map<String, String> defaultValues = new HashMap<>();
    private int user_id;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public TableForm getTableForm() {
        return tableForm;
    }

    public void setTableForm(TableForm tableForm) {
        this.tableForm = tableForm;
    }

    public Map<String, String> getDefaultValues() {
        return defaultValues;
    }

    public void setDefaultValues(Map<String, String> defaultValues) {
        this.defaultValues = defaultValues;
    }

    public int getUser_id() {
        return user_id;
    }

    public void setUser_id(int user_id) {
        this.user_id = user_id;
    }
}
