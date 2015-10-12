/**
 * Created by steve on 10/11/15.
 */
var app = angular.module('formEditor',[]);
    app.directive('formEditor',
    [function () {
        return {
            restrict: 'AE'
            , scope: {
                content: '='
            }
            , link: function(scope, element, attrs){

                //var editor = new UE.ui.Editor({initialContent: scope.content,toolleipi:true});
                //editor.render(element[0]);
                //
                //editor.ready(function(){
                //    editor.addListener('contentChange', function(){
                //        scope.content = editor.getContent();
                //        scope.$root.$$phase || scope.$apply();
                //    });
                //
                //    scope.$watch('content', function(newValue){
                //        editor.setContent(newValue);
                //    });
                //});
            }
        }
    }]);