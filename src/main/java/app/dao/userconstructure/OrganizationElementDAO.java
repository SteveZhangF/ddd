package app.dao.userconstructure;

import app.model.userconstructure.OrganizationElement;

public interface OrganizationElementDAO {

    public void save(OrganizationElement p);

    public OrganizationElement getOEbyID(String uuid);

    public void delete(String id);
}
