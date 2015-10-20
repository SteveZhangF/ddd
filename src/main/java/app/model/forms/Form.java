/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.model.forms;

import app.model.report.Question;

import javax.persistence.*;
import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by steve on 10/20/15.
 */

@Entity
@Table(name = "forms")
public class Form {
//    id: "",
//    createTime: "",
//    updateTime: "",
//    content: "",
//    form_desc: "",
//    form_name: "",
//    questions: []
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String content;
    private Date createTime;
    private Date updateTime;
    private String form_desc;
    private String form_name;
    private FormType formType;

    @ManyToMany
    private List<Question> questions = new ArrayList<>();

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public String getForm_desc() {
        return form_desc;
    }

    public void setForm_desc(String form_desc) {
        this.form_desc = form_desc;
    }

    public String getForm_name() {
        return form_name;
    }

    public void setForm_name(String form_name) {
        this.form_name = form_name;
    }

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

    public FormType getFormType() {
        return formType;
    }

    public void setFormType(FormType formType) {
        this.formType = formType;
    }
}
