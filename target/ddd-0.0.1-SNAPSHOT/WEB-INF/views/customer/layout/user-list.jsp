
<!-- libraries -->
<%@page import="java.util.List"%>
<%@page import="bean.user.User"%>
<link href="css/lib/font-awesome.css" type="text/css" rel="stylesheet" />
<link href="css/lib/jquery.dataTables.css" type="text/css"
	rel="stylesheet" />

<!-- this page specific styles -->
<link rel="stylesheet" href="css/compiled/datatables.css"
	type="text/css" media="screen" />

<!-- open sans font -->
<link
	href='http://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800'
	rel='stylesheet' type='text/css' />
<div id="pad-wrapper" class="datatables-page">

	<div class="row">
		<div class="col-md-12">

			<table id="users">
				<thead>
					<tr>
						<th></th>
						<th>ID</th>
						<th>User Email</th>
						<th>Company Name</th>
						<th></th>
					</tr>
				</thead>

				<tfoot>
					<tr>
						<th></th>
						<th>ID</th>
						<th>User Email</th>
						<th>Company Name</th>
						<th></th>
					</tr>
				</tfoot>
				<tbody>


				</tbody>
			</table>
		</div>
	</div>
</div>

<script src="js/jquery.dataTables.js"></script>
<script type="text/javascript">
function format ( d ) {
    $.post("../user_admin",{action:"getUserDetail",user_id:d.id},function(data){
    	return data;
    });
}
	$(document)
			.ready(
					function() {
						var table = $('#users')
								.DataTable(
										{
											"processing" : true,
											"serverSide" : false,
											"ajax" : {
												"url" : "../user_admin?action=userJSON",
												"type" : "POST"
											},
											"columns" : [

													{ "data":null,
														"title" : "Index",
														createdCell : function(
																nTd, sData,
																oData, iRow,
																iCol) {
															var startnum = this
																	.api()
																	.page()
																	* (this
																			.api().page
																			.info().length);
															$(nTd)
																	.html(
																			iRow
																					+ 1
																					+ startnum);
														}
													}

													,

													{
														"data" : "id"
													}, {
														"data" : "email"
													}, {
														"data" : "company_name"
													},
													{
										                "class":          'details-control',
										                "orderable":      false,
										                "data":           null,
										                "defaultContent": '+'
										            }

											],
										});
						
					    $('#users tbody').on('click', 'td.details-control', function () {
					        var tr = $(this).closest('tr');
					        var row = table.row( tr );
					        if ( row.child.isShown() ) {
					            // This row is already open - close it
					            row.child.hide();
					            tr.removeClass('shown');
					        }
					        else {
					            // Open this row
					            console.log(row);
					            
					            $.post("../user_admin",{action:"getUserDetail",user_id:row.data().id},function(data){
					            	 row.child( data).show();
					            });
					            
					           
					            tr.addClass('shown');
					        }
					    } );
						
						
					});
</script>