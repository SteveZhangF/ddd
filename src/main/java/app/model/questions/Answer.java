/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.model.questions;

import app.model.userconstructure.OrganizationElement;

/**
 * Created by steve on 10/17/15.
 */


public class Answer {

    private int id;

    private String value;

    private Question question;

    private String organizationElement_id;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public String getOrganizationElement_id() {
        return organizationElement_id;
    }

    public void setOrganizationElement_id(String organizationElement_id) {
        this.organizationElement_id = organizationElement_id;
    }
}
