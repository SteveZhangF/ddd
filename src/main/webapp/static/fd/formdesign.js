/**
 * Created by steve on 10/11/15.
 */
(function ($, undefined) {
    $.fn.getCursorPosition = function () {
        var el = $(this).get(0);
        var pos = 0;
        if ('selectionStart' in el) {
            pos = el.selectionStart;
        } else if ('selection' in document) {
            el.focus();
            var Sel = document.selection.createRange();
            var SelLength = document.selection.createRange().text.length;
            Sel.moveStart('character', -el.value.length);
            pos = Sel.text.length - SelLength;
        }
        return pos;
    }
})(jQuery);

(function ($) {
    /**
     * main popup menu for the form designer
     * */
        // Define popup template.
    $.extend($.FroalaEditor.POPUP_TEMPLATES, {
        "formDesigner.popup": '[_BUTTONS_][_CUSTOM_LAYER_]',
        "formDesigner.popupEdit": '[_CUSTOM_LAYER_]'
    });

    // Define popup buttons.
    $.extend($.FroalaEditor.DEFAULTS, {
        formDesignPopupButtons: ['popupClose', '|', 'formDesignText'],
        formDesignPopupUrl: ""
    });

    // The custom popup is defined inside a plugin (new or existing).
    $.FroalaEditor.PLUGINS.formDesigner = function (editor) {
        // Create custom popup.

        var ready = false;


        function initPopup(f) {
            var popup_buttons = '';
            var template = {buttons: popup_buttons, custom_layer: "loading..."};
            readTemplateReady = false;
            // Create the list of buttons.
            if (editor.opts.formDesignPopupButtons.length > 1) {
                popup_buttons += '<div class="fr-buttons">';
                popup_buttons += editor.button.buildList(editor.opts.formDesignPopupButtons);
                popup_buttons += '</div>';
            }
            // Load popup template.
            var custom_layer = "Loading...";
            // get the template
            url = editor.opts.formDesignPopupUrl;
            console.log(url + "==>init");
            $.get(url, function (data) {
                template = {
                    buttons: popup_buttons,
                    custom_layer: data
                };
                hidePopup();
                editor.popups.create('formDesigner.popup', template);
                f();

            });
            // Create popup.
        }

        // Show the popup
        function showPopup(url) {
            // Get the popup object defined above.
            var $popup = editor.popups.get('formDesigner.popup');
            var templateUrl = editor.opts.formDesignPopupUrl;
            var ready = false;
            if (templateUrl != url || !$popup) {
                ready = false;
                templateUrl = url;
                editor.opts.formDesignPopupUrl = url;
                initPopup(function () {
                    console.log(editor);
                    ready = true;
                    $popup = editor.popups.get('formDesigner.popup');
                    editor.popups.setContainer('formDesigner.popup', editor.$tb);
                    var $btn = editor.$tb.find('.fr-command[data-cmd="showFormDesign"]');
                    var left = $btn.offset().left + $btn.outerWidth() / 2;
                    var top = $btn.offset().top + (editor.opts.toolbarBottom ? 10 : $btn.outerHeight() - 10);
                    editor.popups.show('formDesigner.popup', left, top, $btn.outerHeight());

                    editor.popups.onRefresh('formDesigner.popup', function () {
                        console.log('refresh');
                    });

                    // Assign hide handler.
                    editor.popups.onHide('formDesigner.popup', function () {
                        console.log('hide');
                    });

                    /**
                     * 显示时
                     * 1.载入选择的DOM，
                     * 2.暂存selection
                     * */
                    if(typeof(_shown)=='function'){
                        _shown();
                    }
                    editor.selection.save();
                    console.log("save..");
                    // Show the custom popup.
                    // The button's outerHeight is required in case the popup needs to be displayed above
                });

            } else {
                ready = true;
            }
            // Set the editor toolbar as the popup's container.
            //console.log(editor.popups.get('formDesigner.popup'));
            if (ready = true) {
                //editor.destory('formDesigner.popup');
                editor.popups.setContainer('formDesigner.popup', editor.$tb);
                var $btn = editor.$tb.find('.fr-command[data-cmd="showFormDesign"]');
                var left = $btn.offset().left + $btn.outerWidth() / 2;
                var top = $btn.offset().top + (editor.opts.toolbarBottom ? 10 : $btn.outerHeight() - 10);

                //save the state
                editor.selection.save();
                console.log("save..");
                // Show the custom popup.
                // The button's outerHeight is required in case the popup needs to be displayed above it.
                editor.popups.show('formDesigner.popup', left, top, $btn.outerHeight());
                if(typeof(_shown)=='function'){
                    _shown();
                }
            } else {

            }
        }

        // Hide the custom popup.
        function hidePopup() {
            editor.popups.hide('formDesigner.popup');
        }

        var _ok;

        function _ok_callback(callback) {
            //$popup = editor.popups.get('formDesigner.popup');
            _ok = callback;
        }

        /**
         * insert the generated element in to the editor
         * */
        function ok() {
            if (typeof(_ok) == "function") {
                var value = _ok();
                editor.selection.restore();
                console.log("restore..");
                editor.html.insert(value, true);
            }
        }

        /**
         * show when mouse over
         * */
        var editorTmp = {custom_layer: "loading..."};

        var selectedElement;
        /**
         * mouse over, show edit
         * */
        function showEdit(event) {
            console.log(event);
            $currentTarget = $(event.currentTarget);
            var type = $currentTarget.attr('leipiplugins');
            if (type) {
                editorTmp.custom_layer = "<nobr>Text Field: <span onclick=''>Edit</span>&nbsp;&nbsp;<span onclick=\"showDialog('"+type+"')\">Delete</span></nobr>";
                $popup = editor.popups.get('formDesigner.popup');

                selectedElement = $currentTarget;

                console.log(editorTmp.custom_layer);
             //   editorTmp.custom_layer = editorTmp.custom_layer + "<script>$(\'#formDesigner\').froalaEditor(\"formDesigner._ok_callback\", ok);</script>";
                console.log("it is a text field");
                editor.popups.create('formDesigner.popupEdit', editorTmp);

                var left = $currentTarget.offset().left;
                var top = $currentTarget.offset().top;
                editor.popups.show('formDesigner.popupEdit', left, top, top);

            }
        }
        var _shown;
        function _show_callback(shown){
            if(typeof(shown)=='function'){
                _shown = shown;
            }
        }
        function getSelectedElement(f){
            console.log(selectedElement+"==>in designer");
            f(selectedElement);
            return selectedElement;
        }

        /**
         * hide mouse over edit
         * */
        function hideEdit() {
            editor.popups.hide('formDesigner.popupEdit');
        }

        // Methods visible outside the plugin.
        return {
            showPopup: showPopup,
            hidePopup: hidePopup,
            _ok_callback: _ok_callback,
            ok: ok,
            showEdit: showEdit,
            hideEdit: hideEdit,
            _show_callback:_show_callback,
            getSelectedElement: getSelectedElement
        }
    };
    // Define an icon and command for the button that opens the custom popup.
    $.FroalaEditor.DefineIcon('buttonIcon', {NAME: 'star'});
    $.FroalaEditor.RegisterCommand('showFormDesign', {
        title: 'Show Popup',
        icon: 'buttonIcon',
        undo: false,
        focus: false,
        callback: function () {
            this.formDesigner.showPopup("fd/leipi.html");
        }
    });

    // Define custom popup close button icon and command.
    $.FroalaEditor.DefineIcon('popupClose', {NAME: 'times'});
    $.FroalaEditor.RegisterCommand('popupClose', {
        title: 'Close',
        undo: false,
        focus: false,
        callback: function () {
            this.formDesigner.hidePopup();
            //console.log("fd/macros.html");
            //this.formDesigner.showPopup("fd/error.html");
        }
    });

    $.FroalaEditor.DefineIcon('formDesignText', {NAME: 'star'});
    $.FroalaEditor.RegisterCommand('formDesignText', {
        title: 'Insert Text input field',
        undo: false,
        focus: false,
        callback: function () {
            this.formDesigner.ok();
        }
    });

})(jQuery);