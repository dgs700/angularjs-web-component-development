(function(){
    'use strict';
    angular.module('UIComponents', ['uiComponents.dropdown','uiComponents.navbar']);

    var navbarTpl = '<nav class="navbar navbar-default navbar-static">'
        + '<div class="container-fluid">'
        + '<div class="navbar-header">'
        + '<button class="navbar-toggle" type="button">'
        + '<span class="sr-only">Toggle navigation</span>'
        + '<span class="icon-bar"></span>'
        + '<span class="icon-bar"></span>'
        + '<span class="icon-bar"></span>'
        + '</button>'
        + '<a class="navbar-brand" ng-href="{{ homeUrl }}">Company Name</a>'
        + '</div>'
        + '<div class="collapse navbar-collapse bs-example-js-navbar-collapse">'
        + '<ul class="nav navbar-nav">'
        + '<uic-dropdown-menu ng-repeat="menu in menus"></uic-dropdown-menu>'
        + '</ul>'
        + '<ul class="nav navbar-nav" ng-transclude>'
        + '</ul>'
        + '</div>'
        + '</div>'
        + '</nav>';

    angular.module('uiComponents.navbar',[])
        .directive('uicNavBar',[function(){
            return {
                template: navbarTpl,
                restrict: 'E',
                transclude: true,
                replace: true,
                scope: {},
                controller: function($scope, $element, $attrs, $injector, $window){
                    $scope.menus = $window.UIC.header;
                },
                link: function(scope, iElement, iAttrs, controller){}
            };
        }]);
//todo - static vs fixed option
//todo - get collapsed DD working

    var dropdownTpl = '<li class="dropdown open">'
        + '<a ng-href="titleUrl" class="dropdown-toggle">{{ menuText }}<b class="caret"></b></a>'
        + '<ul class="dropdown-menu">'
        + '  <li ng-repeat="item in menuItems">'
        + '    <a ng-href="{{ item.url }}" ng-bind="item.text"></a>'
        + '  </li>'
        + '</ul>'
        + '<ul class="dropdown-menu" ng-show="noJson" ng-transclude></ul>'
        + '</li>';

    angular.module('uiComponents.dropdown',['ui.bootstrap.dropdown'])
        .directive('uicDropdownMenu', [function(){
            return {
                template: dropdownTpl,
                restrict: 'E',
                replace: true,
                transclude: true,
                scope: {},
                controller: function($scope, $element, $attrs, $injector){
                    angular.forEach($scope.$parent.menu, function(X,Y){
                        if(angular.isArray(X)){
                            $scope.menuText = Y;
                            $scope.menuItems = X;
                        }
                    });
                    if($attrs.text) $scope.menuText = $attrs.text;
                    if(!$scope.menuItems) $scope.noJson = true;
                },
                link: function(scope, iElement, iAttrs, controller){}
            };
        }])
        .directive('uicMenuItem', [function(){
            return {
                require: '^uicDropdownMenu',
                template: '<li><a ng-href="{{ url }}" ng-bind="title"></a></li>',
                replace: true,
                restrict: 'E',
                scope: {
                    title: '@',
                    url: '@'
                }
            };
        }])
    ;

//todo - check if inner dropdowns in html or using json
//todo - same for dropdown and nav items

angular.module('ui.bootstrap.dropdown', [])
    .constant('dropdownConfig', {
        openClass: 'open'
    })
    .service('dropdownService', ['$document', function($document) {
        var openScope = null;
        this.open = function( dropdownScope ) {
            if ( !openScope ) {
                $document.bind('click', closeDropdown);
                $document.bind('keydown', escapeKeyBind);
            }
            if ( openScope && openScope !== dropdownScope ) {
                openScope.isOpen = false;
            }
            openScope = dropdownScope;
        };
        this.close = function( dropdownScope ) {
            if ( openScope === dropdownScope ) {
                openScope = null;
                $document.unbind('click', closeDropdown);
                $document.unbind('keydown', escapeKeyBind);
            }
        };
        var closeDropdown = function() {
            openScope.$apply(function() {
                openScope.isOpen = false;
            });
        };
        var escapeKeyBind = function( evt ) {
            if ( evt.which === 27 ) {
                openScope.focusToggleElement();
                closeDropdown();
            }
        };
    }])

    .controller('DropdownController', [
        '$scope',
        '$attrs',
        '$parse',
        'dropdownConfig',
        'dropdownService',
        '$animate', function($scope, $attrs, $parse, dropdownConfig, dropdownService, $animate) {
            var self = this,
                scope = $scope.$new(), // create a child scope so we are not polluting original one
                openClass = dropdownConfig.openClass,
                getIsOpen,
                setIsOpen = angular.noop,
                toggleInvoker = $attrs.onToggle ? $parse($attrs.onToggle) : angular.noop;
            this.init = function( element ) {
                self.$element = element;
                if ( $attrs.isOpen ) {
                    getIsOpen = $parse($attrs.isOpen);
                    setIsOpen = getIsOpen.assign;
                    $scope.$watch(getIsOpen, function(value) {
                        scope.isOpen = !!value;
                    });
                }
            };

            this.toggle = function( open ) {
                return scope.isOpen = arguments.length ? !!open : !scope.isOpen;
            };

            // Allow other directives to watch status
            this.isOpen = function() {
                return scope.isOpen;
            };

            scope.focusToggleElement = function() {
                if ( self.toggleElement ) {
                    self.toggleElement[0].focus();
                }
            };

            scope.$watch('isOpen', function( isOpen, wasOpen ) {
                $animate[isOpen ? 'addClass' : 'removeClass'](self.$element, openClass);
                if ( isOpen ) {
                    scope.focusToggleElement();
                    dropdownService.open( scope );
                } else {
                    dropdownService.close( scope );
                }
                setIsOpen($scope, isOpen);
                if (angular.isDefined(wasOpen) && isOpen !== wasOpen) {
                    toggleInvoker($scope, { open: !!isOpen });
                }
            });

            $scope.$on('$locationChangeSuccess', function() {
                scope.isOpen = false;
            });

            $scope.$on('$destroy', function() {
                scope.$destroy();
            });
        }])

    .directive('dropdown', function() {
        return {
            restrict: 'CA',
            controller: 'DropdownController',
            link: function(scope, element, attrs, dropdownCtrl) {
                dropdownCtrl.init( element );
            }
        };
    })

    .directive('dropdownToggle', function() {
        return {
            restrict: 'CA',
            require: '?^dropdown',
            link: function(scope, element, attrs, dropdownCtrl) {
                if ( !dropdownCtrl ) {
                    return;
                }

                dropdownCtrl.toggleElement = element;

                var toggleDropdown = function(event) {
                    event.preventDefault();
                    event.stopPropagation();

                    if ( !element.hasClass('disabled') && !attrs.disabled ) {
                        scope.$apply(function() {
                            dropdownCtrl.toggle();
                        });
                    }
                };

                element.bind('click', toggleDropdown);

                // WAI-ARIA
                element.attr({ 'aria-haspopup': true, 'aria-expanded': false });
                scope.$watch(dropdownCtrl.isOpen, function( isOpen ) {
                    element.attr('aria-expanded', !!isOpen);
                });

                scope.$on('$destroy', function() {
                    element.unbind('click', toggleDropdown);
                });
            }
        };
    });

})();




