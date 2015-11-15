/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.service.userFields;

import app.model.userfield.JobTitle;
import app.model.userfield.RecordConfig;
import app.newService.IBaseGenericService;

import java.util.List;

/**
 * Created by steve on 11/13/15.
 */
public interface RecordConfigService extends IBaseGenericService<RecordConfig,String> {
    List<RecordConfig> getRecordConfigByUserIdAndTableFormId(int userId,String tableFormId);
}
