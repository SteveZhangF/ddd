
var leipiFormDesign = {

    fnCheckForm: function (type) {
        if (leipiEditor.queryCommandState('source'))
            leipiEditor.execCommand('source');//切换到编辑模式才提交，否则有bug

        if (leipiEditor.hasContents()) {
            leipiEditor.sync();

            //  <input id="form_id" type = "hidden" name="form_id" value=""/>
        //<input id="creator" type = "hidden" name="creator" value=""/>
        //        <input type="hidden" name="fields" id="fields" value="0">

            var formid = $("#form_id").val();
            var form_name = $("#form_name").val();
            var creator = $("#creator").val();
            var form_desc =$("#form_desc").val();
            var fields_count = $("#fields").val();


            if (typeof type !== 'undefined') {
                type_value = type;
            }
            //get the content of the editor
            formeditor = leipiEditor.getContent();
            //parse the form and get the result
            var parse_form = this.parse_form(formeditor, fields_count);
            var data1 =  {
                id: formid,
                    form_name: form_name,
                    form_desc: form_desc,
                    creator: creator,
                    fields_count: parse_form.fields_count,
                    context: parse_form.context,
                    context_parse: parse_form.context_parse,
                    data: parse_form.data
            }
            //submit the result to the server
            console.log(data1);
            console.log(JSON.stringify(data1));
            //$.ajax({
            //    type: 'POST',
            //    url: '/formtable/',
            //    //dataType : 'json',
            //    data: {
            //        id: formid,
            //        form_name: form_name,
            //        form_desc: form_desc,
            //        creator: creator,
            //        fields_count: fields_count,
            //        context: parse_form.context,
            //        context_parse: parse_form.context_parse,
            //        data: parse_form.data
            //    },
            //    success: function (data) {
            //        if (confirm('Success!')) {
            //            console.log(data);
            //        }
            //    }
            //});

        } else {
            alert('Can not be empty！')
            $('#submitbtn').button('reset');
            return false;
        }
    },
    /*preview*/
    fnReview: function () {
        if (leipiEditor.queryCommandState('source'))
            leipiEditor.execCommand('source');

        if (leipiEditor.hasContents()) {
            leipiEditor.sync();
            /*sync the content*/

            alert("你点击了预览,请自行处理....");
            return false;
            //--------------以下仅参考-------------------------------------------------------------------


            /*设计form的target 然后提交至一个新的窗口进行预览*/
            document.saveform.target = "mywin";
            window.open('', 'mywin', "menubar=0,toolbar=0,status=0,resizable=1,left=0,top=0,scrollbars=1,width=" + (screen.availWidth - 10) + ",height=" + (screen.availHeight - 50) + "\"");

            document.saveform.action = "/index.php?s=/index/preview.html";
            document.saveform.submit(); //提交表单
        } else {
            alert('表单内容不能为空！');
            return false;
        }
    }
};