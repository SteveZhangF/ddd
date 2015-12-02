/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.model.files;

import app.model.common.CommonField;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by steve on 11/23/15.
 */
@Entity
@Table
public class QuestionFileElement extends FileElement {
    public QuestionFileElement() {
        setLeaf(true);
        setRoot(false);
        setType(FileType.QUESTION);
    }

    private String questionType;
    @Lob
    @Column(columnDefinition = "BLOB")
    private String content;// how the question looks like

    @OneToMany(cascade = CascadeType.ALL)
    @LazyCollection(LazyCollectionOption.FALSE)
    @Cascade(org.hibernate.annotations.CascadeType.REMOVE)
    private List<CommonField> options = new ArrayList<>();

    public String getQuestionType() {
        return questionType;
    }

    public void setQuestionType(String questionType) {
        this.questionType = questionType;
    }

    public List<CommonField> getOptions() {
        return options;
    }

    public void setOptions(List<CommonField> options) {
        this.options = options;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public enum QuestionType {

    }

    public QuestionFileElement clone() throws CloneNotSupportedException {
        QuestionFileElement p;
        p = (QuestionFileElement) super.clone();
        List<CommonField> options = new ArrayList<>();
        for(CommonField option: this.getOptions()){
            CommonField op = option.clone();
            op.setId(0);
            options.add(op);
        }
        p.setOptions(options);
        return p;
    }
}
