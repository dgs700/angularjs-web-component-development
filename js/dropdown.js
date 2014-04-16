(function(){
    'use strict';
    angular.module('UIComponents',['uiComponents.dropdown','uiComponents.navbar']);

    var dropdownTpl = '<li class="dropdown open">'
                + '<a href="#" class="dropdown-toggle">Dropdown <b class="caret"></b></a>'
                + '<ul class="dropdown-menu">'
                + '<li><a href="#">Item 1</a></li>'
                + '<li><a href="#">Item 2</a></li>'
                + '</ul>'
                + '</li>';

    angular.module('uiComponents.dropdown',[])
        .directive('uicDropdownMenu',[function(){
            return {
                template: dropdownTpl,
                restrict: 'E',
                replace: true,
                scope: {},
                controller: function(){},
                link: function(){}
            };
        }]);

    var navbarTpl = '<nav class="navbar navbar-default navbar-static">'
        + '<div class="container-fluid">'
        + '<div class="navbar-header">'
        + '<button class="navbar-toggle" type="button">'
        + '<span class="sr-only">Toggle navigation</span>'
        + '<span class="icon-bar"></span>'
        + '<span class="icon-bar"></span>'
        + '<span class="icon-bar"></span>'
        + '</button>'
        + '<a class="navbar-brand" href="#">Company Name</a>'
        + '</div>'
        + '<div class="collapse navbar-collapse bs-example-js-navbar-collapse">'
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
                controller: function(){},
                link: function(){}
            };
        }]);
})();









