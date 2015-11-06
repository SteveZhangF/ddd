/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.service.question;

import app.model.report.Record;
import app.newService.IBaseGenericService;

import java.util.List;
import java.util.Map;

/**
 * Created by steve on 10/18/15.
 */
public interface RecordService  extends IBaseGenericService<Record,Integer>{
     List<Record> getListbyParams(Map<String, Object> map);
}
