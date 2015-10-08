
package app.service.system;

import app.model.user.User;

public interface UserService {
 
    User findById(int id);
     
    User findBySso(String sso);
    
    void save(User user);
    
    void update(User user);
     
}