package app.model.userconstructure;

import java.util.ArrayList;
import java.util.List;

import app.model.form.Module;
import app.model.form.record.FormRecord;


public class FormRecordShower<T extends OrganizationElement> {

	
	
	private OrganizationElement oe;
	
	public FormRecordShower(T oe){
		this.oe = oe;
	}
	
	public List<FormRecord> getFilledReord(){
		return this.oe.getRecords();
	}
	
	public List<Module> getAllModule(){
//		Company c = oe.getCompany();
		return new ArrayList<Module>();
//		return c.getModules();
		
	}
}
