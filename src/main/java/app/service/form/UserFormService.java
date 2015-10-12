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
     * @param oe_id the id of who had filled the form and submit
     * */
    public void insert(int formID,int oe_id,Map<String,Object> values);
    /**
     * get the result
     * @Param formID
     * @param map foreign key value map  */
    public List query(int formID, Map<String, Object> map) throws ClassNotFoundException;

}
