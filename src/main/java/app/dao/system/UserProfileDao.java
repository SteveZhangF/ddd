/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.dao.system;

import app.dao.AbstractDao;
import app.model.user.UserProfile;
import app.model.user.UserProfileType;

/**
 * Created by steve on 10/10/15.
 */
public interface UserProfileDao {
    UserProfile findbyID(int id);
    UserProfile findbyType(UserProfileType type);
}
