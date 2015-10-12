package app.dao.form;

import app.dao.AbstractDao;
import app.model.form.ColumnAttribute;

/**
 * Created by steve on 10/9/15.
 */
public class ColumnAttributeDaoImpl extends AbstractDao<Integer, ColumnAttribute> implements ColumnAttributeDao {
    @Override
    public void update(ColumnAttribute columnAttribute) {
        ColumnAttribute ca = super.getByKey(columnAttribute.getId());
        if (ca != null) {
            ca.setColumn_Name(columnAttribute.getColumn_Name());
            ca.setColumn_type(columnAttribute.getColumn_type());
            ca.setPlugins(columnAttribute.getPlugins());
            ca.setTitle(columnAttribute.getTitle());
            ca.setLength(ca.getLength());
        }
    }
}

