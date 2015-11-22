/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.service.form;

import app.model.forms.CustomizedElement;
import app.model.forms.CustomizedElementRecord;
import app.model.forms.CustomizedElementRecordValue;
import app.newService.IBaseGenericService;

import java.util.List;

/**
 * Created by steve on 11/22/15.
 */
public interface CustomizedElementRecordService extends IBaseGenericService<CustomizedElementRecord,String> {

    List<CustomizedElementRecord> listCustomizedElementRecordByUserIdAndElementId(int userId,CustomizedElement elementId);

    void createCustomizedElementRecord(int userId,CustomizedElement customizedElement,List<CustomizedElementRecordValue> values);
}
