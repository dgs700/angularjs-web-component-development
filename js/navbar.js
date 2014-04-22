(function(){
    'use strict';
    angular.module('UIComponents', ['uiComponents.dropdown', 'uiComponents.navbar', 'ui.bootstrap.custom']);

    // html5 markup that replaces custom <uic-nav-bar> component element
    var navbarTpl =
        '<nav id="uic-navbar" class="navbar navbar-inverse" ng-class="position">'
            + '  <div class="container-fluid">'
            + '    <div class="navbar-header">'
            + '      <button class="navbar-toggle" type="button" ng-click="isCollapsed = !isCollapsed">'
            + '        <span class="sr-only">Toggle navigation</span>'
            + '        <span class="icon-bar"></span>'
            + '        <span class="icon-bar"></span>'
            + '        <span class="icon-bar"></span>'
            + '      </button>'
            + '      <a class="navbar-brand" ng-href="{{ homeUrl }}">Brand Logo</a>'
            + '    </div>'
            + '    <div class="collapse navbar-collapse" collapse="isCollapsed">'
            // this renders if menu json data is available
            + '      <ul class="nav navbar-nav" ng-hide="minimalHeader">'
            + '        <uic-dropdown-menu ng-repeat="menu in menus"></uic-dropdown-menu>'
            + '      </ul>'
            // this renders if the designer includes markup for dropdowns
            + '      <ul class="nav navbar-nav" ng-hide="minimalHeader" ng-transclude></ul>'

            + '    </div>'
            + '  </div>'
            + '</nav>';

    angular.module('uiComponents.navbar', ['uiComponents.dropdown'])
        // utility functions for nav bar population
        .service('uicNavBarService', [
            '$window', function($window){

                // functionality can expanded to include menu data via REST
                // check if a menus json object is available
                this.getMenus = function(){
                    if($window.UIC && $window.UIC.header){
                        return $window.UIC.header;
                    }else{
                        return false;
                    }
                };
            }])

        // Navigation Bar Container Component
        .directive('uicNavBar', [
            'uiCdropdownService',
            'uicNavBarService', function( uiCdropdownService, uicNavBarService){
                return {
                    template: navbarTpl,
                    // component directives should be elements only
                    restrict: 'E',
                    // allow page designer to include dropdown elements
                    transclude: true,
                    // replace custom tags with standard html5 markup
                    replace: true,
                    // isolate scope
                    scope: {
                        // attribute API for hiding dropdowns
                        minimalHeader: '@minimal'
                    },
                    controller: function($scope, $element, $attrs){

                        // at the mobile width breakpoint
                        // the Nav Bar items are not initially visible
                        $scope.isCollapsed = true;

                        // menu json data if available
                        $scope.menus = uicNavBarService.getMenus();

                        // keep track of added dropdowns
                        // for container level manipulation if needed
                        $scope.registeredMenus = [];

                        // listen for minimize event
                        $scope.$on('header-minimize', function(){
                            $scope.minimalHeader = true;
                        });

                        // listen for maximize event
                        $scope.$on('header-maximize', function(){
                            $scope.minimalHeader = false;
                        });
                    },
                    link: function(scope, iElement, iAttrs){
                        // know who the tenants are
                        // note that this link function executes *after*
                        // the link functions of any inner components
                        scope.registeredMenus = uiCdropdownService.getDropdowns();

                        // Attr API option for sticky vs fixed
                        scope.position = (iAttrs.sticky == 'true') ? 'navbar-fixed-top' : 'navbar-static-top';
                    }
                };
            }]);
})();




