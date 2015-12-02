/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.model.files;

import javax.persistence.Entity;

/**
 * Created by steve on 11/28/15.
 */
@Entity
public class EmployeeFieldFileElement extends QuestionFileElement {
    public EmployeeFieldFileElement() {
        setLeaf(true);
        setRoot(false);
        setType(FileType.EMPLOYEE_FIELD);
    }
    public EmployeeFieldFileElement clone() throws CloneNotSupportedException {
        EmployeeFieldFileElement p;
        p = (EmployeeFieldFileElement) super.clone();
        return p;
    }
}
