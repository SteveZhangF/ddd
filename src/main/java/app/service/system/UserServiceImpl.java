package app.service.system;

import app.dao.system.UserDao;
import app.model.user.User;
import app.newService.BaseGenericServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service("userService")
@Transactional
public class UserServiceImpl extends BaseGenericServiceImpl<User, Integer> implements UserService {

    @Autowired
    private UserDao dao;

    public User findById(int id) {
        return dao.get(id);
    }

    public User findBySso(String sso) {
        return dao.findBySSO(sso);
    }

    @Override
    public void save(User user) {
        dao.save(user);
    }

    @Override
    public void saveOrUpdate(User entity) {
        super.saveOrUpdate(entity);
    }

    @Override
    public void delete(User entity) {
        super.delete(entity);
    }

    @Override
    public User get(Integer id) {
        return super.get(id);
    }

    @Override
    public User load(Integer id) {
        return null;
    }

    @Override
    public List<User> loadAll() {
        return null;
    }

    @Override
    public List<User> list() {
        return dao.loadAll();
    }

    @Override
    public void update(User entity) {
        super.update(entity);
    }
}
