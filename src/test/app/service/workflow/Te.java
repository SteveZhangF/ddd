/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.service.workflow;

import org.junit.Test;
import org.springframework.test.context.TestExecutionListeners;

import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;

/**
 * Created by steve on 10/18/15.
 */
public class Te {

    @Test
    public void test() {
        long x = 1000000000;
        long result =  (x - 1) % 9 + 1;
        Timestamp date = new Timestamp(new java.util.Date().getTime());
        System.out.println(date);
        System.out.println(result);
    }
}
