var leipiEditor = UE.getEditor('myFormDesign', {
    //allowDivTransToP: false,//阻止转换div 为p
    toolleipi: true,//是否显示，设计器的 toolbars
    textarea: 'design_content',
    //这里可以选择自己需要的工具按钮名称,此处仅选择如下五个
    toolbars: [[
        'fullscreen', 'source', '|', 'undo', 'redo', '|', 'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'removeformat', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', '|', 'fontfamily', 'fontsize', '|', 'indent', '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'link', 'unlink', '|', 'horizontal', 'spechars', 'wordimage', '|', 'inserttable', 'deletetable', 'mergecells', 'splittocells']],
    //focus时自动清空初始化时的内容
    //autoClearinitialContent:true,
    //关闭字数统计
    wordCount: false,
    //关闭elementPath
    elementPathEnabled: false,
    //默认的编辑区域高度
    initialFrameHeight: 300
    ///,iframeCssUrl:"css/bootstrap/css/bootstrap.css" //引入自身 css使编辑器兼容你网站css
    //更多其他参数，请参考ueditor.config.js中的配置项
});

var leipiFormDesign = {
    /*执行控件*/
    exec: function (method) {
        leipiEditor.execCommand(method);
    },
    /*
     Javascript 解析表单
     template 表单设计器里的Html内容
     fields 字段总数
     */
    parse_form: function (template, fields) {
        //正则  radios|checkboxs|select 匹配的边界 |--|  因为当使用 {} 时js报错
        console.log(fields);

        var preg = /(\|-<span(((?!<span).)*leipiplugins=\"(radios|checkboxs|select)\".*?)>(.*?)<\/span>-\||<(img|input|textarea|select).*?(<\/select>|<\/textarea>|\/>))/gi, preg_attr = /(\w+)=\"(.?|.+?)\"/gi, preg_group = /<input.*?\/>/gi;
        if (!fields) fields = 0;

        var template_parse = template, template_data = new Array(), add_fields = new Object(), checkboxs = 0;

        var pno = 0;
        template.replace(preg, function (plugin, p1, p2, p3, p4, p5, p6) {
            var parse_attr = new Array(), attr_arr_all = new Object(), name = '', select_dot = '', is_new = false;
            var p0 = plugin;
            var tag = p6 ? p6 : p4;
            //alert(tag + " \n- t1 - "+p1 +" \n-2- " +p2+" \n-3- " +p3+" \n-4- " +p4+" \n-5- " +p5+" \n-6- " +p6);

            if (tag == 'radios' || tag == 'checkboxs') {
                plugin = p2;
            } else if (tag == 'select') {
                plugin = plugin.replace('|-', '');
                plugin = plugin.replace('-|', '');
            }
            plugin.replace(preg_attr, function (str0, attr, val) {
                if (attr == 'name') {
                    if (val == 'leipiNewField') {
                        is_new = true;
                        fields++;
                        val = 'data_' + fields;
                    }
                    name = val;
                }

                if (tag == 'select' && attr == 'value') {
                    if (!attr_arr_all[attr]) attr_arr_all[attr] = '';
                    attr_arr_all[attr] += select_dot + val;
                    select_dot = ',';
                } else {
                    attr_arr_all[attr] = val;
                }
                var oField = new Object();
                oField[attr] = val;
                parse_attr.push(oField);
            })
            /*alert(JSON.stringify(parse_attr));return;*/
            if (tag == 'checkboxs') /*复选组  多个字段 */
            {
                plugin = p0;
                plugin = plugin.replace('|-', '');
                plugin = plugin.replace('-|', '');
                var name = 'checkboxs_' + checkboxs;
                attr_arr_all['parse_name'] = name;
                attr_arr_all['name'] = '';
                attr_arr_all['value'] = '';

                attr_arr_all['content'] = '<span leipiplugins="checkboxs"  title="' + attr_arr_all['title'] + '">';
                var dot_name = '', dot_value = '';
                p5.replace(preg_group, function (parse_group) {
                    var is_new = false, option = new Object();
                    parse_group.replace(preg_attr, function (str0, k, val) {
                        if (k == 'name') {
                            if (val == 'leipiNewField') {
                                is_new = true;
                                fields++;
                                val = 'data_' + fields;
                            }

                            attr_arr_all['name'] += dot_name + val;
                            dot_name = ',';

                        }
                        else if (k == 'value') {
                            attr_arr_all['value'] += dot_value + val;
                            dot_value = ',';

                        }
                        option[k] = val;
                    });

                    if (!attr_arr_all['options']) attr_arr_all['options'] = new Array();
                    attr_arr_all['options'].push(option);
                    //if(!option['checked']) option['checked'] = '';
                    var checked = option['checked'] != undefined ? 'checked="checked"' : '';
                    attr_arr_all['content'] += '<input type="checkbox" name="' + option['name'] + '" value="' + option['value'] + '"  ' + checked + '/>' + option['value'] + '&nbsp;';

                    if (is_new) {
                        var arr = new Object();
                        arr['name'] = option['name'];
                        arr['leipiplugins'] = attr_arr_all['leipiplugins'];
                        add_fields[option['name']] = arr;

                    }

                });
                attr_arr_all['content'] += '</span>';

                //parse
                template = template.replace(plugin, attr_arr_all['content']);
                template_parse = template_parse.replace(plugin, '{' + name + '}');
                template_parse = template_parse.replace('{|-', '');
                template_parse = template_parse.replace('-|}', '');
                template_data[pno] = attr_arr_all;
                checkboxs++;

            } else if (name) {
                if (tag == 'radios') /*单选组  一个字段*/
                {
                    plugin = p0;
                    plugin = plugin.replace('|-', '');
                    plugin = plugin.replace('-|', '');
                    attr_arr_all['value'] = '';
                    attr_arr_all['content'] = '<span leipiplugins="radios" name="' + attr_arr_all['name'] + '" title="' + attr_arr_all['title'] + '">';
                    var dot = '';
                    p5.replace(preg_group, function (parse_group) {
                        var option = new Object();
                        parse_group.replace(preg_attr, function (str0, k, val) {
                            if (k == 'value') {
                                attr_arr_all['value'] += dot + val;
                                dot = ',';
                            }
                            option[k] = val;
                        });
                        option['name'] = attr_arr_all['name'];
                        if (!attr_arr_all['options']) attr_arr_all['options'] = new Array();
                        attr_arr_all['options'].push(option);
                        //if(!option['checked']) option['checked'] = '';
                        var checked = option['checked'] != undefined ? 'checked="checked"' : '';
                        attr_arr_all['content'] += '<input type="radio" name="' + attr_arr_all['name'] + '" value="' + option['value'] + '"  ' + checked + '/>' + option['value'] + '&nbsp;';

                    });
                    attr_arr_all['content'] += '</span>';

                } else {
                    attr_arr_all['content'] = is_new ? plugin.replace(/leipiNewField/, name) : plugin;
                }
                //attr_arr_all['itemid'] = fields;
                //attr_arr_all['tag'] = tag;
                template = template.replace(plugin, attr_arr_all['content']);
                template_parse = template_parse.replace(plugin, '{' + name + '}');
                template_parse = template_parse.replace('{|-', '');
                template_parse = template_parse.replace('-|}', '');
                if (is_new) {
                    var arr = new Object();
                    arr['name'] = name;
                    arr['leipiplugins'] = attr_arr_all['leipiplugins'];
                    add_fields[arr['name']] = arr;
                }
                template_data[pno] = attr_arr_all;


            }
            pno++;
        })
        return {
            fields_count: fields,//总字段数
            context: template,//完整html
            context_parse: template_parse,//控件替换为{data_1}的html
            data: template_data,//控件属性
            add_fields: add_fields//新增控件
        };
    },
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