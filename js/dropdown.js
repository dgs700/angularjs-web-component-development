(function(){
    'use strict';
    angular.module('UIComponents', ['uiComponents.dropdown', 'uiComponents.navbar']);

    // html5 markup that replaces custom <uic-nav-bar> component element
    var navbarTpl =
          '<nav class="navbar navbar-default navbar-static">'
        + '  <div class="container-fluid">'
        + '    <div class="navbar-header">'
        + '      <button class="navbar-toggle" type="button">'
        + '        <span class="sr-only">Toggle navigation</span>'
        + '        <span class="icon-bar"></span>'
        + '        <span class="icon-bar"></span>'
        + '        <span class="icon-bar"></span>'
        + '      </button>'
        + '      <a class="navbar-brand" ng-href="{{ homeUrl }}">Company Name</a>'
        + '    </div>'
        + '    <div class="collapse navbar-collapse bs-example-js-navbar-collapse">'
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
                    scope.registeredMenus = uiCdropdownService.getDropdowns();
                }
            };
        }]);
//todo - static vs fixed option
//todo - get collapsed DD working

    // html5 markup that replaces custom <uic-dropdown-menu> component element
    var dropdownTpl =
          '<li>'
        // directive to toggle display of dropdown
        + '  <a dropdown-toggle>{{ dropdownTitle }}<b class="caret"></b></a>'
        // this handles menu items supplied via JSON
        + '  <ul class="dropdown-menu">'
        + '    <li ng-repeat="item in menuItems">'
        + '      <a ng-href="{{ item.url }}" ng-bind="item.text"></a>'
        + '    </li>'
        + '  </ul>'
        // this handles menu items supplied via markup
        + '  <ul class="dropdown-menu" ng-show="noJson" ng-transclude></ul>'
        + '</li>';

    // Dropdown Menu Component
    // Credit for portions of logic to the Angular-UI Bootstrap team
    // https://github.com/angular-ui/bootstrap

    angular.module('uiComponents.dropdown', [])
        .service('uiCdropdownService', ['$document', function($document){
            // currently displayed dropdown
            var openScope = null;
            // array of added dropdown scopes
            var dropdowns = [];

            // event handler for click evt
            function closeDropdown( evt ) {
                if (evt && evt.isDefaultPrevented()) {
                    return;
                }
                openScope.$apply(function() {
                    openScope.isOpen = false;
                });
            };

            // event handler for escape key
            function escapeKeyBind( evt ) {
                if ( evt.which === 27 ) {
                    openScope.focusToggleElement();
                    closeDropdown();
                }
            };

            // exposed functions
            return {
                // called by linking fn of dropdown directive
                register: function(scope){
                    dropdowns.push(scope);
                },

                // access dropdown array
                getDropdowns: function(){
                    return dropdowns;
                },

                // access a single dropdown scope by $id
                getById: function(id){
                    var x;
                    for(x = 0; x < dropdowns.length; x++){
                        if(id === dropdowns[x].$id) return dropdowns[x];
                    }
                    return false;
                },

                // open a particular dropdown and set close evt bindings
                open: function( dropdownScope ) {
                    if ( !openScope ) {
                        $document.bind('click', closeDropdown);
                        $document.bind('keydown', escapeKeyBind);
                    }
                    if ( openScope && openScope !== dropdownScope ) {
                        openScope.isOpen = false;
                    }
                    openScope = dropdownScope;
                },

                // close a particular dropdown and set close evt bindings
                close: function( dropdownScope ) {
                    if ( openScope === dropdownScope ) {
                        openScope = null;
                        // cleanup to prevent memory leaks
                        $document.unbind('click', closeDropdown);
                        $document.unbind('keydown', escapeKeyBind);
                    }
                }
            };
        }])

        // Primary dropdown compomnent direcitve
        // this is also technically a container component
        .directive('uicDropdownMenu', [
            '$parse',
            '$animate',
            'uiCdropdownService', function($parse, $animate, uiCdropdownService){
            return {
                template: dropdownTpl,
                // component directives should be elements only
                restrict: 'E',
                // replace custom tags with standard html5 markup
                replace: true,
                // allow page designer to include menu item elements
                transclude: true,
                // isolate scope
                scope: {},
                controller: function($scope, $element, $attrs){

                    // persistent instance reference
                    var that = this,
                    // class that sets display: block
                        openClass = 'open';

                    // supply the view-model with info from json if available
                    // this only handles data from scopes generated by ng-repeat
                    angular.forEach( $scope.$parent.menu, function(menuItems, dropdownTitle){
                        if(angular.isArray(menuItems)){
                            $scope.dropdownTitle = dropdownTitle;
                            $scope.menuItems = menuItems;
                        }
                    });

                    // supply string value for dropdown title via attribute API
                    if($attrs.text) $scope.dropdownTitle = $attrs.text;

                    // indicate if this component was created via data or markup
                    // and hide the empty <ul> if needed
                    if(!$scope.menuItems) $scope.noJson = true;

                    // add angular element reference to controller instance
                    // for later class toggling
                    this.init = function( element ) {
                        that.$element = element;
                    };

                    // toggle the dropdown $scope.isOpen boolean
                    this.toggle = function( open ) {
                        $scope.isOpen = arguments.length ? !!open : !$scope.isOpen;
                        return $scope.isOpen;
                    };

                    // set browser focus on active dropdown
                    $scope.focusToggleElement = function() {
                        if ( that.toggleElement ) {
                            that.toggleElement[0].focus();
                        }
                    };

                    // all dropdowns need to watch the value of this expr
                    // and set evt bindings and classes accordingly
                    $scope.$watch('isOpen', function( isOpen, wasOpen ) {
                        $animate[isOpen ? 'addClass' : 'removeClass'](that.$element, openClass);
                        if ( isOpen ) {
                            $scope.focusToggleElement();
                            uiCdropdownService.open($scope);
                        } else {
                            uiCdropdownService.close($scope);
                        }
                    });

                    // listen for client side route changes
                    $scope.$on('$locationChangeSuccess', function() {
                        $scope.isOpen = false;
                    });
                },
                link: function(scope, iElement, iAttrs, dropdownCtrl){
                    dropdownCtrl.init( iElement );
                    // add to tracked array of dropdown scopes
                    uiCdropdownService.register(scope);
                }
            };
        }])

        // a simple menu item component directive
        .directive('uicMenuItem', [function(){
            return {
                // replace custom element with html5 markup
                template: '<li><a ng-href="{{ url }}" ng-bind="title"></a></li>',
                replace: true,
                restrict: 'E',

                scope: {
                    // attibute API for menu item text
                    title: '@',
                    // attribute API for menu href URL
                    url: '@'
                }
            };
        }])

        // from Angular ui.bootstrap.dropdownToggle
        // helper directive for setting active/passive state on the
        // necessary elements
        .directive('dropdownToggle', function() {
            return {
                // keep to attributes since this is not a UI component
                restrict: 'A',
                // list of UI components to work for
                require: '?^uicDropdownMenu',
                link: function(scope, element, attrs, dropdownCtrl) {
                    // render inert if no dropdown controller is injected
                    if ( !dropdownCtrl ) {
                        return;
                    }

                    // set the toggle element in the dropdown component
                    dropdownCtrl.toggleElement = element;

                    // click event listener for this directive
                    var toggleDropdown = function(event) {
                        event.preventDefault();
                        event.stopPropagation();

                        if ( !element.hasClass('disabled') && !attrs.disabled ) {
                            // call toggle() on the correct component scope
                            scope.$apply(function() {
                                dropdownCtrl.toggle();
                            });
                        }
                    };

                    // add click evt binding
                    element.bind('click', toggleDropdown);

                    // clean up click event binding
                    scope.$on('$destroy', function() {
                        element.unbind('click', toggleDropdown);
                    });
                }
            };
        })
    ;
})();




