/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.model.files;

import app.model.wordflow.WorkFlow;

import javax.persistence.Entity;
import javax.persistence.OneToOne;

/**
 * Created by steve on 11/23/15.
 */
@Entity
public class FolderFileElement extends FileElement {
    public FolderFileElement(){
        this.setLeaf(false);
        setType(FileType.FOLDER);
    }

    private String workFlow_id;

    public String getWorkFlow_id() {
        return workFlow_id;
    }

    public void setWorkFlow_id(String workFlow_id) {
        this.workFlow_id = workFlow_id;
    }
}
