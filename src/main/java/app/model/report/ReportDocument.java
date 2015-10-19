/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.model.report;

import app.model.form.FormType;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by steve on 10/18/15.
 */
@Table(name="report_document")
@Entity
public class ReportDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String report_name;// name of the form


    private FormType formType;

    private String report_description;// description of the form
    @Lob
    @Column(columnDefinition = "BLOB")
    private String context;// the origin context
    @Lob
    @Column(columnDefinition = "BLOB")
    private String context_parse; // the pared context

    @OneToMany
    private List<Question> questions = new ArrayList<>();

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getReport_name() {
        return report_name;
    }

    public void setReport_name(String report_name) {
        this.report_name = report_name;
    }

    public FormType getFormType() {
        return formType;
    }

    public void setFormType(FormType formType) {
        this.formType = formType;
    }

    public String getReport_description() {
        return report_description;
    }

    public void setReport_description(String report_description) {
        this.report_description = report_description;
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
}
