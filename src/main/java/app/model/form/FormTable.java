package app.model.form;

import app.model.wordflow.WorkFlowNodeElement;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.sql.Time;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by steve on 10/9/15.
 */
@Entity
@Table(name = "tbl_forms")
public class FormTable implements WorkFlowNodeElement{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String form_name;// name of the form

    private String form_desc;// description of the form
    @Lob
    @Column(name = "context", columnDefinition = "BLOB")
    private String context;// the origin context
    @Lob
    @Column(name = "context_parse", columnDefinition = "BLOB")
    private String context_parse; // the pared context

    private int fields_count; // the columnAttributes count
    private boolean is_del; // is deleted

    private String creator;

    private Time createTime;
    private Time updateTime;

    public Time getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Time createTime) {
        this.createTime = createTime;
    }

    public Time getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Time updateTime) {
        this.updateTime = updateTime;
    }

    @JsonIgnore
    @OneToMany(mappedBy = "formTable") // --->
    @Cascade({org.hibernate.annotations.CascadeType.ALL})
    @LazyCollection(LazyCollectionOption.FALSE) // --->
    private List<ColumnAttribute> columnAttributes = new ArrayList<ColumnAttribute>();


    public List<ColumnAttribute> getColumnAttributes() {
        return columnAttributes;
    }

    public void setColumnAttributes(List<ColumnAttribute> columnAttributes) {
        this.columnAttributes = columnAttributes;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getForm_name() {
        return form_name;
    }

    public void setForm_name(String form_name) {
        this.form_name = form_name;
    }

    public String getForm_desc() {
        return form_desc;
    }

    public void setForm_desc(String form_desc) {
        this.form_desc = form_desc;
    }

    public String getContext() {
        return context;
    }

    public void setContext(String context) {
        this.context = context;
    }

    public String getContext_parse() {
        return context_parse;
    }

    public void setContext_parse(String context_parse) {
        this.context_parse = context_parse;
    }

    public int getFields_count() {
        return fields_count;
    }

    public void setFields_count(int fields_count) {
        this.fields_count = fields_count;
    }

    public boolean is_del() {
        return is_del;
    }

    public void setIs_del(boolean is_del) {
        this.is_del = is_del;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }


}
