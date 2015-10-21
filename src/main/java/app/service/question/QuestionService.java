/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.service.question;

import app.model.report.Question;
import app.newService.IBaseGenericService;

/**
 * Created by steve on 10/18/15.
 */
public interface QuestionService extends IBaseGenericService<Question,Integer> {

    void setPluginId(Question question);
}
