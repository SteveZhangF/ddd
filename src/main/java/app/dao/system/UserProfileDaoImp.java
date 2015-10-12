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
import app.model.userconstructure.Company;
import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 * Created by steve on 10/10/15.
 */
@Repository("userProfileDao")
@Transactional
public class UserProfileDaoImp extends AbstractDao<Integer,UserProfile> implements  UserProfileDao {

    @Override
    public UserProfile findbyID(int id) {
        return super.getByKey(id);
    }

    @Override
    public UserProfile findbyType(UserProfileType type) {
        Criteria crit = createEntityCriteria();
        crit.add(Restrictions.eq("type", type.getUserProfileType()));
        return (UserProfile) crit.uniqueResult();
    }
}
