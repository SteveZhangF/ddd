package app.service.form;

import java.util.List;
import java.util.Map;

/**
 * Created by steve on 10/10/15.
 */
public interface UserFormService {
    /**
     * insert value into the customized table
     * @param formID which table;
     * */
    public void insert(int formID,Map<String,Object> values);
    /**
     * get the result
     * @Param formID
     * @param map foreign key value map  */
    public List query(int formID, Map<String, Object> map) throws ClassNotFoundException;

}
