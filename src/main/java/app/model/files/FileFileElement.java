/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.model.files;

import app.model.report.Question;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by steve on 11/23/15.
 */
@Entity
public class FileFileElement extends FileElement {

    public FileFileElement() {
        setLeaf(true);
        setRoot(false);
        setType(FileType.FILE);
    }


    @ManyToMany
    @LazyCollection(LazyCollectionOption.FALSE)
    private List<QuestionFileElement> questions = new ArrayList<>();

    @Lob
    @Column(columnDefinition = "BLOB")
    private String content;

    @Enumerated(EnumType.STRING)
    private FileFileType fileType;

    public FileFileType getFileType() {
        return fileType;
    }

    public void setFileType(FileFileType fileType) {
        this.fileType = fileType;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public List<QuestionFileElement> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuestionFileElement> questions) {
        this.questions = questions;
    }

    public enum FileFileType{
        CompanyFile,EmployeeReport
    }
    public FileFileElement clone() throws CloneNotSupportedException {
        FileFileElement p;
        p = (FileFileElement) super.clone();
        return p;
    }
}

