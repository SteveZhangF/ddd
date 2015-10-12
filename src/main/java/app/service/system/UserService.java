package app.service.system;

import app.model.user.User;

import java.util.List;

public interface UserService {

    User findById(int id);

    User findBySso(String sso);

    void save(User user);

    void update(User user);

    List<User> list();

}