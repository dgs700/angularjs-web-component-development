(function(){
    'use strict';
    angular.module('UIComponents',['uiComponents.smartButton'])
    .run(['$rootScope', '$window', function($rootScope, $window){
        // let's change the style class of a clicked smart button
        $rootScope.$on('smart-button-click', function(evt){
            // AngularJS creates unique IDs for every instantiated scope
            var targetComponentId = evt.targetScope.$id;
            var command = {setClass: 'btn-warning'};
            $rootScope.$broadcast('smart-button-command', targetComponentId, command);
        });
        $rootScope.showAlert = function (message) {
            $window.alert(message);
            return message;
        };
    }]);
})();
