(function(){
    'use strict';

    //@import "../build/tmp/SmartButton.tpl.js";

    var buttons = angular.module('uiComponents.smartButton', []);
    buttons.directive('smartButton', ['$timeout', function($timeout){
//        var tpl = '<a ng-class="bttnClass" '
//            + 'ng-click="doSomething(this);debug()">{{bttnText}}</a>';
        //var tpl = '<a ng-class="bttnClass"'
        //        + 'ng-click="doSomething(this);debug()">{{bttnText}} <span ng-transclude></span></a>';
        return {
            template: tpl, // use an inline template for increaced
            restrict: 'E', // restrict directive matching to elements
            replace: true,
            transclude: true,
            // create an isolate scope
            scope: {
                debug: '&'
            },
            controller: function($scope, $element, $attrs, $injector){
                // declare some default values
                $scope.bttnClass = 'btn btn-default';
                $scope.bttnText = $scope.defaultText = 'Smart Button';
                $scope.activeText = 'Processing...';
                // a nice way to pull a core service into a directive
                //var $timeout = $injector.get('$timeout');
                // on click change text to activeText
                // after 3 seconds change text to something else
                $scope.doSomething = function(elem){
                    $scope.bttnText = $scope.activeText;
                    $timeout(function(){
                        $scope.bttnText = "We're Done!";
                    }, 3000);
                    // emit a click event
                    $scope.$emit('smart-button-click', elem);
                };

                // listen for an event from a parent container
                $scope.$on('smart-button-command', function(evt, targetComponentId, command){
                    // check that our instance is the target
                    if(targetComponentId === $scope.$id){
                        // we can add any number of actions here
                        if(command.setClass){
                            // change the button style from default
                            $scope.bttnClass = 'btn ' + command.setClass;
                        }
                    }
                });
            },
            link: function(scope, iElement, iAttrs, controller){
                // <string> button text
                if(iAttrs.defaultText){
                    scope.bttnText = scope.defaultText = iAttrs.defaultText;
                }
                // <string> button text to diplay when active

                if(iAttrs.activeText){
                    scope.activeText = iAttrs.activeText;
                }
            }
        };
    }]);
})();



