package app.dao.system;

import app.dao.AbstractDao;
import app.model.user.User;
import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository("userDao")
public class UserDaoImpl extends AbstractDao<Integer, User> implements UserDao {

    public User findById(int id) {
        return getByKey(id);
    }

    public User findBySSO(String sso) {
        Criteria crit = createEntityCriteria();
        crit.add(Restrictions.eq("ssoId", sso));
        return (User) crit.uniqueResult();
    }

    @Override
    public void save(User user) {
        super.persist(user);
    }

    @Override
    public List<User> list() {
        List<User> users = super.createEntityCriteria().list();
        return users;
    }

    @Override
    public void update(User user) {
    }
}
