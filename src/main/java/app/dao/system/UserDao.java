package app.dao.system;

import app.model.user.User;

import java.util.List;

public interface UserDao {

    User findById(int id);

    User findBySSO(String sso);

    void save(User user);

    List<User> list();

    void update(User user);

}
