(function(){
    'use strict';
    angular.module('UIComponents', ['uiComponents.dropdown', 'uiComponents.navbar', 'ui.bootstrap.custom']);

    // html5 markup that replaces custom <uic-nav-bar> component element
    var navbarTpl =
        '<nav id="uic-navbar" class="navbar navbar-inverse" ng-class="[position,theme]">'
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
            + '      <ul class="nav navbar-nav" ng-hide="minimalHeader" uic-include></ul>'
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

        // utility directive that replaces ngTransclude to bind the content
        // to a child scope of the directive rather than a sibling scope
        // which allows the container component complete control of its
        // contents
        .directive('uicInclude', function(){
            return {
                restrict: 'A',
                link: function(scope, iElement, iAttrs, ctrl, $transclude) {
                    $transclude(scope, function(clone) {
                        iElement.append(clone);
                    });
                }
            };
        })

        // Navigation Bar Container Component
        .directive('uicNavBar', [
            'uicDropdownService',
            'uicNavBarService',
            '$location', function( uicDropdownService, uicNavBarService, $location){
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
                        minimalHeader: '@minimal',
                        homeUrl: '@'
                    },
                    controller: [
                        '$scope',
                        '$element',
                        '$attrs', function($scope, $element, $attrs){

                        // at the mobile width breakpoint
                        // the Nav Bar items are not initially visible
                        $scope.isCollapsed = true;

                        // menu json data if available
                        $scope.menus = uicNavBarService.getMenus();

                        // keep track of added dropdowns
                        // for container level manipulation if needed
                        $scope.registeredMenus = [];

                        // listen for minimize event
                        $scope.$on('header-minimize', function(evt){
                            $scope.minimalHeader = true;
                        });

                        // listen for maximize event
                        $scope.$on('header-maximize', function(evt){
                            $scope.minimalHeader = false;
                        });

                        // listen for dropdown open event
                        $scope.$on('dropdown-opened', function(evt){
                            // perform an action when a child dropdown is opened
                        });

                        // listen for dropdown close event
                        $scope.$on('dropdown-closed', function(evt){
                            // perform an action when a child dropdown is closed
                        });

                        // listen for menu item event
                        $scope.$on('menu-item-selected', function(evt, scope){
                            // grab the url string from the menu iten scope
                            var url;
                            try{
                                url = scope.url || scope.item.url;
                                // handle navigation programatically
                                $location.path(url);
                            }catch(err){
                                //$console.log('no url')
                            }
                        });
                    }],
                    link: function(scope, iElement, iAttrs, ctrl, $transclude){

                        // know who the tenants are
                        // note that this link function executes *after*
                        // the link functions of any inner components
                        // at this point we could extend our NavBar component
                        // functionality to rebuild menus based on new json or
                        // disable individual menu items based on $location
                        scope.registeredMenus = uicDropdownService.getDropdowns();

                        // Attr API option for sticky vs fixed
                        scope.position = (iAttrs.sticky == 'true') ? 'navbar-fixed-top' : 'navbar-static-top';
                        scope.theme = (iAttrs.theme) ? iAttrs.theme : null;;
                    }
                };
            }]);
})();




