'use strict';

app.factory('FormService', ['$http', '$q', function ($http, $q) {

    return {

        fetchAllForms: function () {
            return $http.get('/formtable/')
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    console.error('Error while fetching users');
                    return $q.reject(errResponse);
                }
            );
        },

        fetchOneForm: function (id) {
            return $http.get('/formtable/'+id)
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    console.error('Error while fetching users');
                    return $q.reject(errResponse);
                }
            );
        },

        createForm: function (form) {
            return $http.post('/formtable/', form)
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    console.error('Error while creating user');
                    return $q.reject(errResponse);
                }
            );
        },

        updateForm: function (form, id) {
            return $http.put('/formtable/' + id, form)
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    console.error('Error while updating form');
                    return $q.reject(errResponse);
                }
            );
        },

        deleteForm: function (id) {
            return $http.delete('/formtable/' + id)
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    console.error('Error while deleting user');
                    return $q.reject(errResponse);
                }
            );
        },

        parse_form: function (template, fields) {
            //正则  我日了狗了。<input/> 和<input> !!!!!!匹配了一整天
            var preg = /((\S\s)*\|-<span(((?!<span).)*leipiplugins=\"(radios|checkboxs|select)\".*?)>(.*?)<\/span>-\||<(img|input|textarea|select).*?(<\/select>|<\/textarea>|>))/gi,
                preg_attr = /(\w+)=\"(.?|.+?)\"/gi, preg_group = /<input.*?\/>/gi;
            if (!fields) fields = 0;

            var template_parse = template, template_data = new Array(), add_fields = new Object(), checkboxs = 0;

            var pno = 0;
            template.replace(preg, function (plugin, p1, p2, p3, p4, p5, p6) {
                console.log("replaceing...");
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
            });
            return {
                fields_count: fields,//总字段数
                context: template,//完整html
                context_parse: template_parse,//控件替换为{data_1}的html
                data: template_data,//控件属性
                add_fields: add_fields//新增控件
            };
        }

    };

}]);