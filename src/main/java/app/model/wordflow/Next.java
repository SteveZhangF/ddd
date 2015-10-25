/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.model.wordflow;

import javax.persistence.*;

/**
 * Created by steve on 10/24/15.
 */
@Entity
@Table(name="Next")
public class Next {

    public Next() {
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String _if;
    private String _then;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }


    public String get_if() {
        return _if;
    }

    public void set_if(String _if) {
        this._if = _if;
    }

    public String get_then() {
        return _then;
    }

    public void set_then(String _then) {
        this._then = _then;
    }
}
