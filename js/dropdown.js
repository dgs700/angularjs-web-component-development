(function(){
    'use strict';

//todo - check for href string and set ".disabled" class if none

    // html5 markup that replaces custom <uic-dropdown-menu> component element
    var dropdownTpl =
        // the "namespaced" .uic-dropdown class can be used to provide
        // some encapsulation for the component css
          '<li class="uic-dropdown">'
        // directive to toggle display of dropdown
        + '  <a dropdown-toggle>{{ dropdownTitle }}<b class="caret"></b></a>'
        // this handles menu items supplied via JSON
        + '  <ul class="dropdown-menu" ng-if="jsonData">'
        // set .disabled class if no url provided
        + '    <li ng-repeat="item in menuItems" ng-class="disablable" ng-init="disablable=(item.url)?null:\'disabled\'">'
        + '      <a ng-href="{{ item.url }}" ng-bind="item.text" ng-click="selected($event, this)"></a>'
        + '    </li>'
        + '  </ul>'
        // this handles menu items supplied via markup
        + '  <ul class="dropdown-menu" ng-if="!jsonData" ng-transclude></ul>'
        + '</li>';

    // Dropdown Menu Component
    // Credit for portions of logic to the Angular-UI Bootstrap team
    // https://github.com/angular-ui/bootstrap

    angular.module('uiComponents.dropdown', [])

        // because we have a tansclusion option for the dropdowns we cannot
        // reliably track open menu status at the component scope level
        // so we prefer to dedicate a service to this task rather than pollute
        // the $rootScope
        .service('uicDropdownService', ['$document', function($document){
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
            'uicDropdownService', function($parse, $animate, uicDropdownService){
            return {
                template: dropdownTpl,
                // component directives should be elements only
                restrict: 'E',
                // replace custom tags with standard html5 markup
                replace: true,
                // allow page designer to include menu item elements
                transclude: true,
                // isolate scope
                scope: {
                    url: '@'
                },
                controller: function($scope, $element, $attrs){

                    //$scope.disablable = '';

                    // persistent instance reference
                    var that = this,
                    // class that sets display: block
                        closeClass = 'close',
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
                    if($scope.menuItems) $scope.jsonData = true;

                    // add angular element reference to controller instance
                    // for later class toggling if desired
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

                    $scope.selected = function($event, scope){
                        $scope.$emit('menu-item-selected', scope);
                        $event.preventDefault();
                        $event.stopPropagation();
                        // optionally perform some action before navigation
                    }

                    // all dropdowns need to watch the value of this expr
                    // and set evt bindings and classes accordingly
                    $scope.$watch('isOpen', function( isOpen, wasOpen ) {
                        if ( isOpen ) {
                            $scope.focusToggleElement();
                            uicDropdownService.open($scope);

                            $scope.$emit('dropdown-opened');
                        } else {
                            uicDropdownService.close($scope);
                            //
                            $scope.$emit('dropdown-closed');
                        }
                    });

                    // listen for client side route changes
                    $scope.$on('$locationChangeSuccess', function() {
                        //$scope.isOpen = false;
                    });

                    // listen for menu item selected events
                    $scope.$on('menu-item-selected', function(evt, element) {
                        // do something when a child menu item is selected
                    });
                },
                link: function(scope, iElement, iAttrs, dropdownCtrl){
                    dropdownCtrl.init( iElement );
                    // add to tracked array of dropdown scopes
                    uicDropdownService.register(scope);
                }
            };
        }])

        // the angular version of $('.dropdown-menu').slideToggle(200)
        .directive('dropdownMenu', function(){
            return {
                restrict: 'C',
                link: function(scope, element, attr) {
                    scope.$watch('isOpen', function( isOpen, wasOpen ){
                        if(isOpen !== wasOpen){
                            element.stop().slideToggle(200);
                        }
                    });
                }
            };
        })

        // a simple menu item component directive
        .directive('uicMenuItem', [function(){
            return {
                // replace custom element with html5 markup
                template: '<li ng-class="disablable">' +
                    '<a ng-href="{{ url }}" ng-bind="text" ng-click="selected($event, this)"></a>' +
                    '</li>',
                replace: true,
                restrict: 'E',

                scope: {
                    // attibute API for menu item text
                    text: '@',
                    // attribute API for menu href URL
                    url: '@'
                },
                controller: function($scope, $element, $attrs){

                    $scope.disablable = '';

                    // called on ng-click
                    $scope.selected = function($event, scope){
                        $scope.$emit('menu-item-selected', scope);
                        $event.preventDefault();
                        $event.stopPropagation();
                        // optionally perform some action before navigation
                    }
                },
                link: function(scope, iElement, iAttrs){
           //console.warn(scope)
                    if(!scope.url) scope.disablable = 'disabled';
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




