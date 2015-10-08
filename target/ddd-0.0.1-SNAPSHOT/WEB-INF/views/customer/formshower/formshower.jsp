<%@page import="database.dao.factory.DAOFactoryImpl"%>
<%@page import="bean.user.data.OrganizationElement"%>
<%@page import="bean.user.data.Employee"%>
<%
	String oe_id = request.getParameter("oe_id");
	OrganizationElement oe = DAOFactoryImpl.getOrganizationElementDAO().getOEbyID(oe_id);
%>
<style>
#form_menu_side {
	position: fixed;
	width: 180px;
	padding: 20px;
	top: 120px;
	right: 0px;
	border: 2px solid #b2afaf;
}

.wizard-actions {
	float: right;
	margin-top: 30px;
	margin-right: 130px;
}

.wizard-actions .btn-next {
	margin-left: 15px;
}

.wizard-actions .btn-finish {
	display: none;
	margin-left: 15px;
}
</style>
<input id="onload_oe_id" type="hidden" name="oe_id" value="<%=oe_id%>">

<div id="form_content"></div>
<div id="form_submit_button_group">
	<button id="bt_submit" onclick="submitCustomizedForm();"
		class="btn btn-primary">Save</button>
	<button id="bt_cancel" onclick="" class="btn btn-primary">Cancel</button>

	<button id="bt_preview" class="btn btn-primary">Preview</button>
</div>

<div class="wizard-actions ">
	<button type="button" id="button_prev" disabled="" class="btn-glow primary btn-prev" onclick="prevForm()">
		<i class="icon-chevron-left"></i> Prev
	</button>
	<button type="button" id="button_next" onclick="nextForm();"class="btn-glow primary btn-next">
		Next <i class="icon-chevron-right"></i>
	</button>
</div>
<div id="form_menu_side">

	<ul class="nav navbar-nav" id="form_menu_side_ul">
	</ul>

</div>

<!-- preview modal start -->

<div class="modal fade" id="preview_container" tabindex="-1"
	role="dialog" aria-labelledby="myModalLabel">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal"
					aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
				<h4 class="modal-title" id="myModalLabel">Preview</h4>
			</div>
			<div class="modal-body" id="preview_container_body"></div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
				<button type="button" class="btn btn-primary">Print</button>
			</div>
		</div>
	</div>
</div>
<!-- preview modal end -->






<script src="<%=application.getContextPath()%>/custom/js/leftmenu.js">
</script>
<script>
function viewForm2(obj){
	$this = $(obj);
	var key=$this.attr("id");
	var oe_id = $("#onload_oe_id").attr("value");
	viewForm(key,oe_id);
	nowSelected=get(key);
	setButtons();
}
//hashmap is used to store key: formid, value: listnode
	var hashMap =  {
		data : []
	};
	function put(key,value){
		hashMap.data[key]=value;
	}
	function get(key){
		return hashMap.data[key];
	}


function nextForm(){
	var oe_id = $("#onload_oe_id").attr("value");
	viewForm(nowSelected.next.value_id,oe_id);
	nowSelected = nowSelected.next;
	setButtons();

}

function prevForm(){
	var oe_id = $("#onload_oe_id").attr("value");
	viewForm(nowSelected.prev.value_id,oe_id);
	nowSelected = nowSelected.prev;
	console.log(nowSelected);
	setButtons();
	
}
function setButtons(){
	
	if(nowSelected.prev!=null){
		$("#button_prev").removeAttr("disabled");
	}else{
		$("#button_prev").attr("disabled","");
	}
	if(nowSelected.next!=null){
		$("#button_next").removeAttr("disabled");
	}else{
		$("#button_next").attr("disabled","");
	}
}
var formlistNode=function(){
		value_id=null;
		next=null;
		prev=null;
}
var nowSelected = new formlistNode;
var firstNode=new formlistNode;
$(document).ready(function(){
	var oe_id = $("#onload_oe_id").attr("value");
	$.getJSON('<%=application.getContextPath()%>/userform', {
			action : 'showFormSelectJson',
			oe_id : oe_id
		}, function(data) {
			var prev = new formlistNode;
			$.each(data, function(j,m) {
				var moduleid = m.id;
				var modulename = m.name;
				var forms = m.forms;
/* 				<li class="dropdown"><a href="#" class="dropdown-toggle"
					data-toggle="dropdown" role="button" aria-haspopup="true"
					aria-expanded="false">Dropdown <span class="caret"></span></a>
					<ul class="dropdown-menu">
						<li><a href="#">Separated link</a></li>
						<li><a href="#">One more separated link</a></li>
					</ul></li> */
					
				//$module_li = $("<li class='dropdown'><a href='#' class='dropdown-toggle'	data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>"+modulename+" <span class='caret'></span></a></li>");
				$module_li = $("<li class=''><a href='#' class=''	data-toggle='' role='button' >"+modulename+" <span class='caret'></span></a></li>");
				//$module_ul=$("<ul class='dropdown-menu'></ul>");
				$module_ul=$("<ul class=''></ul>");
				$module_li.append($module_ul);
				
				$("#form_menu_side_ul").append($module_li);
				

				
				$.each(forms,function(i,f){
					var form_name = f.name;
					var form_id = f.uuid;
					$form_li=$("<li></li>");
					$form_li_a = $("<a id='"+form_id+"'href='javascript:void(0)'></a>");
					$form_li_a.text(form_name);
					$form_li_a.attr("onclick",'viewForm2(this)');
					$form_li.append($form_li_a);
					$module_ul.append($form_li);
					if(i==0 && j==0){
						viewForm(form_id,oe_id);
						firstNode.value_id=form_id;
						prev = firstNode;
						nowSelected = firstNode;
						put(form_id,firstNode);
					}else{
						var nowNode = new formlistNode();
						nowNode.prev=prev;
						nowNode.value_id=form_id;
						prev.next=nowNode;
						prev = nowNode;
						put(form_id,nowNode);
					}
				})
				
			});
			console.log(nowSelected);
		});
	});
</script>
