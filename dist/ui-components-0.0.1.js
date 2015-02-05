/*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/

 * Version: 0.10.0 - 2014-01-15
 * License: MIT
 */
angular.module("ui.bootstrap.custom", ["ui.bootstrap.transition","ui.bootstrap.collapse"]);
angular.module('ui.bootstrap.transition', [])

/**
 * $transition service provides a consistent interface to trigger CSS 3 transitions and to be informed when they complete.
 * @param  {DOMElement} element  The DOMElement that will be animated.
 * @param  {string|object|function} trigger  The thing that will cause the transition to start:
 *   - As a string, it represents the css class to be added to the element.
 *   - As an object, it represents a hash of style attributes to be applied to the element.
 *   - As a function, it represents a function to be called that will cause the transition to occur.
 * @return {Promise}  A promise that is resolved when the transition finishes.
 */
    .factory('$transition', ['$q', '$timeout', '$rootScope', function($q, $timeout, $rootScope) {

        var $transition = function(element, trigger, options) {
            options = options || {};
            var deferred = $q.defer();
            var endEventName = $transition[options.animation ? "animationEndEventName" : "transitionEndEventName"];

            var transitionEndHandler = function(event) {
                $rootScope.$apply(function() {
                    element.unbind(endEventName, transitionEndHandler);
                    deferred.resolve(element);
                });
            };

            if (endEventName) {
                element.bind(endEventName, transitionEndHandler);
            }

            // Wrap in a timeout to allow the browser time to update the DOM before the transition is to occur
            $timeout(function() {
                if ( angular.isString(trigger) ) {
                    element.addClass(trigger);
                } else if ( angular.isFunction(trigger) ) {
                    trigger(element);
                } else if ( angular.isObject(trigger) ) {
                    element.css(trigger);
                }
                //If browser does not support transitions, instantly resolve
                if ( !endEventName ) {
                    deferred.resolve(element);
                }
            });

            // Add our custom cancel function to the promise that is returned
            // We can call this if we are about to run a new transition, which we know will prevent this transition from ending,
            // i.e. it will therefore never raise a transitionEnd event for that transition
            deferred.promise.cancel = function() {
                if ( endEventName ) {
                    element.unbind(endEventName, transitionEndHandler);
                }
                deferred.reject('Transition cancelled');
            };

            return deferred.promise;
        };

        // Work out the name of the transitionEnd event
        var transElement = document.createElement('trans');
        var transitionEndEventNames = {
            'WebkitTransition': 'webkitTransitionEnd',
            'MozTransition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'transition': 'transitionend'
        };
        var animationEndEventNames = {
            'WebkitTransition': 'webkitAnimationEnd',
            'MozTransition': 'animationend',
            'OTransition': 'oAnimationEnd',
            'transition': 'animationend'
        };
        function findEndEventName(endEventNames) {
            for (var name in endEventNames){
                if (transElement.style[name] !== undefined) {
                    return endEventNames[name];
                }
            }
        }
        $transition.transitionEndEventName = findEndEventName(transitionEndEventNames);
        $transition.animationEndEventName = findEndEventName(animationEndEventNames);
        return $transition;
    }]);

angular.module('ui.bootstrap.collapse', ['ui.bootstrap.transition'])

    .directive('collapse', ['$transition', function ($transition, $timeout) {

        return {
            link: function (scope, element, attrs) {

                var initialAnimSkip = true;
                var currentTransition;

                function doTransition(change) {
                    var newTransition = $transition(element, change);
                    if (currentTransition) {
                        currentTransition.cancel();
                    }
                    currentTransition = newTransition;
                    newTransition.then(newTransitionDone, newTransitionDone);
                    return newTransition;

                    function newTransitionDone() {
                        // Make sure it's this transition, otherwise, leave it alone.
                        if (currentTransition === newTransition) {
                            currentTransition = undefined;
                        }
                    }
                }

                function expand() {
                    if (initialAnimSkip) {
                        initialAnimSkip = false;
                        expandDone();
                    } else {
                        element.removeClass('collapse').addClass('collapsing');
                        doTransition({ height: element[0].scrollHeight + 'px' }).then(expandDone);
                    }
                }

                function expandDone() {
                    element.removeClass('collapsing');
                    element.addClass('collapse in');
                    element.css({height: 'auto'});
                }

                function collapse() {
                    if (initialAnimSkip) {
                        initialAnimSkip = false;
                        collapseDone();
                        element.css({height: 0});
                    } else {
                        // CSS transitions don't work with height: auto, so we have to manually change the height to a specific value
                        element.css({ height: element[0].scrollHeight + 'px' });
                        //trigger reflow so a browser realizes that height was updated from auto to a specific value
                        var x = element[0].offsetWidth;

                        element.removeClass('collapse in').addClass('collapsing');

                        doTransition({ height: 0 }).then(collapseDone);
                    }
                }

                function collapseDone() {
                    element.removeClass('collapsing');
                    element.addClass('collapse');
                }

                scope.$watch(attrs.collapse, function (shouldCollapse) {
                    if (shouldCollapse) {
                        collapse();
                    } else {
                        expand();
                    }
                });
            }
        };
    }]);

/*
 AngularJS v1.2.16
 (c) 2010-2014 Google, Inc. http://angularjs.org
 License: MIT
 */
(function(p,h,q){'use strict';function E(a){var e=[];s(e,h.noop).chars(a);return e.join("")}function k(a){var e={};a=a.split(",");var d;for(d=0;d<a.length;d++)e[a[d]]=!0;return e}function F(a,e){function d(a,b,d,g){b=h.lowercase(b);if(t[b])for(;f.last()&&u[f.last()];)c("",f.last());v[b]&&f.last()==b&&c("",b);(g=w[b]||!!g)||f.push(b);var l={};d.replace(G,function(a,b,e,c,d){l[b]=r(e||c||d||"")});e.start&&e.start(b,l,g)}function c(a,b){var c=0,d;if(b=h.lowercase(b))for(c=f.length-1;0<=c&&f[c]!=b;c--);
    if(0<=c){for(d=f.length-1;d>=c;d--)e.end&&e.end(f[d]);f.length=c}}var b,g,f=[],l=a;for(f.last=function(){return f[f.length-1]};a;){g=!0;if(f.last()&&x[f.last()])a=a.replace(RegExp("(.*)<\\s*\\/\\s*"+f.last()+"[^>]*>","i"),function(b,a){a=a.replace(H,"$1").replace(I,"$1");e.chars&&e.chars(r(a));return""}),c("",f.last());else{if(0===a.indexOf("\x3c!--"))b=a.indexOf("--",4),0<=b&&a.lastIndexOf("--\x3e",b)===b&&(e.comment&&e.comment(a.substring(4,b)),a=a.substring(b+3),g=!1);else if(y.test(a)){if(b=a.match(y))a=
    a.replace(b[0],""),g=!1}else if(J.test(a)){if(b=a.match(z))a=a.substring(b[0].length),b[0].replace(z,c),g=!1}else K.test(a)&&(b=a.match(A))&&(a=a.substring(b[0].length),b[0].replace(A,d),g=!1);g&&(b=a.indexOf("<"),g=0>b?a:a.substring(0,b),a=0>b?"":a.substring(b),e.chars&&e.chars(r(g)))}if(a==l)throw L("badparse",a);l=a}c()}function r(a){if(!a)return"";var e=M.exec(a);a=e[1];var d=e[3];if(e=e[2])n.innerHTML=e.replace(/</g,"&lt;"),e="textContent"in n?n.textContent:n.innerText;return a+e+d}function B(a){return a.replace(/&/g,
    "&amp;").replace(N,function(a){return"&#"+a.charCodeAt(0)+";"}).replace(/</g,"&lt;").replace(/>/g,"&gt;")}function s(a,e){var d=!1,c=h.bind(a,a.push);return{start:function(a,g,f){a=h.lowercase(a);!d&&x[a]&&(d=a);d||!0!==C[a]||(c("<"),c(a),h.forEach(g,function(d,f){var g=h.lowercase(f),k="img"===a&&"src"===g||"background"===g;!0!==O[g]||!0===D[g]&&!e(d,k)||(c(" "),c(f),c('="'),c(B(d)),c('"'))}),c(f?"/>":">"))},end:function(a){a=h.lowercase(a);d||!0!==C[a]||(c("</"),c(a),c(">"));a==d&&(d=!1)},chars:function(a){d||
c(B(a))}}}var L=h.$$minErr("$sanitize"),A=/^<\s*([\w:-]+)((?:\s+[\w:-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)\s*>/,z=/^<\s*\/\s*([\w:-]+)[^>]*>/,G=/([\w:-]+)(?:\s*=\s*(?:(?:"((?:[^"])*)")|(?:'((?:[^'])*)')|([^>\s]+)))?/g,K=/^</,J=/^<\s*\//,H=/\x3c!--(.*?)--\x3e/g,y=/<!DOCTYPE([^>]*?)>/i,I=/<!\[CDATA\[(.*?)]]\x3e/g,N=/([^\#-~| |!])/g,w=k("area,br,col,hr,img,wbr");p=k("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr");q=k("rp,rt");var v=h.extend({},q,p),t=h.extend({},p,k("address,article,aside,blockquote,caption,center,del,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,map,menu,nav,ol,pre,script,section,table,ul")),
    u=h.extend({},q,k("a,abbr,acronym,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,q,ruby,rp,rt,s,samp,small,span,strike,strong,sub,sup,time,tt,u,var")),x=k("script,style"),C=h.extend({},w,t,u,v),D=k("background,cite,href,longdesc,src,usemap"),O=h.extend({},D,k("abbr,align,alt,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,coords,dir,face,headers,height,hreflang,hspace,ismap,lang,language,nohref,nowrap,rel,rev,rows,rowspan,rules,scope,scrolling,shape,size,span,start,summary,target,title,type,valign,value,vspace,width")),
    n=document.createElement("pre"),M=/^(\s*)([\s\S]*?)(\s*)$/;h.module("ngSanitize",[]).provider("$sanitize",function(){this.$get=["$$sanitizeUri",function(a){return function(e){var d=[];F(e,s(d,function(c,b){return!/^unsafe/.test(a(c,b))}));return d.join("")}}]});h.module("ngSanitize").filter("linky",["$sanitize",function(a){var e=/((ftp|https?):\/\/|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>]/,d=/^mailto:/;return function(c,b){function g(a){a&&m.push(E(a))}function f(a,c){m.push("<a ");h.isDefined(b)&&
(m.push('target="'),m.push(b),m.push('" '));m.push('href="');m.push(a);m.push('">');g(c);m.push("</a>")}if(!c)return c;for(var l,k=c,m=[],n,p;l=k.match(e);)n=l[0],l[2]==l[3]&&(n="mailto:"+n),p=l.index,g(k.substr(0,p)),f(n,l[0].replace(d,"")),k=k.substring(p+l[0].length);g(k);return a(m.join(""))}}])})(window,window.angular);
//# sourceMappingURL=angular-sanitize.min.js.map
/*
 * AngularComponents
 * https://github.com/dgs700/angularjs-web-component-development.git

 * Version: 0.0.1 - 2015-02-05
 * License: MIT
 */
angular.module("uiComponents", ["uiComponents.dropdown","uiComponents.menuItem","uiComponents.navbar","uiComponents.smartButton"]);
/*Functionality for the dropdown service and dropdown toggle directive provided by the Angular-UI team*/

(function(){
    'use strict';

    var tpl = '';
    tpl = '<li class="uic-dropdown">' +
    '    <a dropdown-toggle' +
    '       ng-bind-html="dropdownTitle"><b class="caret"></b></a>' +
    '    <ul class="dropdown-menu"' +
    '        ng-if="jsonData">' +
    '        <li ng-repeat="item in menuItems"' +
    '            ng-class="disablable"' +
    '            ng-init="disablable=(item.url)?null: \'disabled\'">' +
    '            <a ng-href="{{ item.url }}"' +
    '               ng-bind="item.text"' +
    '               ng-click="selected($event, this)"></a>' +
    '        </li>' +
    '    </ul>' +
    '    <ul class="dropdown-menu"' +
    '        ng-if="!jsonData"' +
    '        ng-transclude></ul>' +
    '</li>';

    // Dropdown Menu Component
    // Credit for portions of logic to the Angular-UI Bootstrap team
    // https://github.com/angular-ui/bootstrap
    angular.module('uiComponents.dropdown', [
            'uiComponents.menuItem',
            'ui.bootstrap.custom',
            'ngSanitize'
        ])

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
            }

            // event handler for escape key
            function escapeKeyBind( evt ) {
                if ( evt.which === 27 ) {
                    openScope.focusToggleElement();
                    closeDropdown();
                }
            }

            // exposed service functions
            return {

                // called by linking fn of dropdown directive
                register: function(scope){
                    dropdowns.push(scope);
                },

                // remove/unregister a dropdown scope
                remove: function(scope){
                    for(var x = 0; x < dropdowns.length; x++){
                        if(dropdowns[x] === scope){
                            dropdowns.splice(x, 1);
                            break;
                        }
                    }
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

        // Primary dropdown component direcitve
        // this is also technically a container component
        .directive('uicDropdownMenu', ['$timeout',
            'uicDropdownService', function($timeout, uicDropdownService){
            return {
                template: tpl,

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
                controller: [
                    '$scope',
                    '$element',
                    '$attrs', function($scope, $element, $attrs){

                    $scope.disablable = '';
                    $scope.isOpen = false;
                    // persistent instance reference
                    var that = this,

                    // class that sets display: block
                        closeClass = 'close',
                        openClass = 'open';

                    // supply the view-model with info from json if available
                    // this only handles data from scopes generated by ng-repeat
                    angular.forEach( $scope.$parent.menu, function(menuItems, dropdownTitle){
                        if(angular.isArray(menuItems)){

                            // uses ng-bind-html for template insertion
                            $scope.dropdownTitle = dropdownTitle + '<b class="caret"></b>';
                            $scope.menuItems = menuItems;

                            // add a unique ID matching title string for future reference
                            $scope.uicId = dropdownTitle;
                        }
                    });
                    // supply string value for dropdown title via attribute API
                    if($attrs.text){
                        $scope.uicId = $attrs.text;
                        $scope.dropdownTitle = $scope.uicId + '<b class="caret"></b>';
                    }
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
                    };

                    // all dropdowns need to watch the value of this expr
                    // and set evt bindings and classes accordingly
                    $scope.$watch('isOpen', function( isOpen, wasOpen ) {
                        if ( isOpen ) {
                            $scope.focusToggleElement();

                            // tell our service we've been opened
                            uicDropdownService.open($scope);

                            // fire off an "opened" event (event API) for any listeners out there
                            $scope.$emit('dropdown-opened');
                        } else {

                            // tell our service we've been closed
                            uicDropdownService.close($scope);

                            // fire a closed event (event API)
                            $scope.$emit('dropdown-closed');
                        }
                    });

                    // listen for client side route changes
                    $scope.$on('$locationChangeSuccess', function() {
                        // some bug in current version of angular is causing
                        // $locationChangeSuccess to be broadcast on app.run()
                        //$scope.isOpen = false;
                    });

                    // listen for menu item selected events
                    $scope.$on('menu-item-selected', function(evt, targetScope) {
                        // do something when a child menu item is selected
                    });
                }],
                link: function(scope, iElement, iAttrs, dropdownCtrl){
                    dropdownCtrl.init( iElement );

                    // add an element ref to scope for future manipulation
                    scope.iElement = iElement;

                    // add to tracked array of dropdown scopes
                    uicDropdownService.register(scope);
                }
            };
        }])

        // the angular version of $('.dropdown-menu').slideToggle(200)
        .directive('dropdownMenu', function(){
            return {

                // match just classnames to stay consistent with other implementations
                restrict: 'C',
                link: function(scope, element, attr) {

                    // set watch on new/old values of isOpen boolean for component instance
                    scope.$watch('isOpen', function( isOpen, wasOpen ){

                        // if we detect that there has been a change for THIS instance
                        if(isOpen !== wasOpen){

                            // stop any existing animation and start the opposite animation
                            element.stop().slideToggle(200);
                        }
                    });
                }
            };
        })

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

                    // prevent the browser default behavior for anchor elements
                    event.preventDefault();
                    event.stopPropagation();

                    // check that we are not disabed before toggling visibility
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
    });
})();





// menu item UI component

(function () {
    "use strict";

    var tpl = '';
    tpl = '<li class="uic-menu-item" ng-class="disablable">' +
    '    <a ng-href="{{ url }}"' +
    '       ng-bind="text"' +
    '       ng-click="selected($event, this)">' +
    '    </a>' +
    '</li>';

    angular.module('uiComponents.menuItem', [])
        // a simple menu item component directive
        .directive('uicMenuItem', [function(){
            return {
                // replace custom element with html5 markup
                //template: '<li class="uic-menu-item" ng-class="disablable">' +
                    // note the use of ng-bind vs. {{}} to prevent any brief flash of the raw template
                //    '<a ng-href="{{ url }}" ng-bind="text" ng-click="selected($event, this)"></a>' +
                //    '</li>',
                template: tpl,
                replace: true,

                // restrict usage to element only
                restrict: 'E',

                // new isolate scope
                scope: {
                    // attibute API for menu item text
                    text: '@',
                    // attribute API for menu href URL
                    url: '@'
                },
                controller: ['$scope', function($scope, $element, $attrs){

                    // the default for the "disabled" API is enabled
                    $scope.disablable = '';

                    // called on ng-click
                    $scope.selected = function($event, scope){

                        // published API for selected event
                        $scope.$emit('menu-item-selected', scope);

                        // prevent the browser behavior for an anchor element click
                        $event.preventDefault();
                        $event.stopPropagation();

                        // optionally perform some other actions before navigation
                    };
                }],
                link: function(scope, iElement, iAttrs){

                    // add the Bootstrap "disabled" class if there is no url
                    if(!scope.url) scope.disablable = 'disabled';
                }
            };
        }]);
})();

(function(){
    'use strict';

    var tpl = '';
    tpl = '<nav id="uic-navbar"' +
    '     class="navbar navbar-inverse"' +
    '     ng-class="[position,theme]">' +
    '    <div class="container-fluid">' +
    '        <div class="navbar-header">' +
    '            <button class="navbar-toggle"' +
    '                    type="button"' +
    '                    ng-click="isCollapsed = !isCollapsed">' +
    '                <span class="sr-only">Toggle navigation</span>' +
    '                <span class="icon-bar"></span>' +
    '                <span class="icon-bar"></span>' +
    '                <span class="icon-bar"></span>' +
    '            </button>' +
    '            <a class="navbar-brand"' +
    '               ng-href="{{ homeUrl }}">Brand Logo</a>' +
    '        </div>' +
    '        <div class="collapse navbar-collapse"' +
    '             collapse="isCollapsed">' +
    '            <ul class="nav navbar-nav uic-data"' +
    '                ng-hide="minimalHeader">' +
    '                <uic-dropdown-menu' +
    '                        ng-repeat="menu in menus">' +
    '                </uic-dropdown-menu>' +
    '            </ul>' +
    '            <ul class="nav navbar-nav uic-include"' +
    '                ng-hide="minimalHeader"' +
    '                uic-include></ul>' +
    '        </div>' +
    '    </div>' +
    '</nav>';

    angular.module('uiComponents.navbar', ['uiComponents.dropdown'])

        // utility functions for nav bar population
        .service('uicNavBarService', [
            '$window', function($window){

                // add menu data manually
                var menus = false;
                this.addMenus = function(data){
                    if(angular.isArray(data)){
                        menus = data;
                    }
                };

                // functionality can expanded to include menu data via REST
                // check if a menus json object is available
                this.getMenus = function(){
                    if($window.UIC && $window.UIC.header){
                        return $window.UIC.header;
                    }else if(menus){
                        return menus;
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
            '$location',
            '$compile',
            '$log', function( uicDropdownService, uicNavBarService, $location, $compile, $log){
                return {
                    template: tpl,
                    restrict: 'E',

                    // allow page designer to include dropdown elements
                    transclude: true,
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

                         // make sure $element is updated to the compiled/linked version
                         var that = this;
                         this.init = function( element ) {
                             that.$element = element;
                         };

                        // add a dropdown to the nav bar during runtime
                        // i.e. upon hash navigation
                        this.addDropdown = function(menuObj){

                            // create an isolate scope instance
                            var newScope = $scope.$root.$new();

                            // attach the json obj data at the same location
                            // as the dropdown controller would
                            newScope.menu = newScope.$parent.menu = menuObj;

                            // manually compile and link a new dropdown component
                            var $el = $compile('<uic-dropdown-menu></uic-dropdown-menu>')(newScope);

                            // retrieve access to the ISOLATE scope so we can
                            // call digest which is necessary for unit test coverage
                            var isolateScope = $el.isolateScope();
                            isolateScope.$digest();

                            // attach the new dropdown to the end of the first child <ul>
                            // todo - add more control over DOM attach points
                            $element.find('ul').last().append( $el );
                        };

                        // remove a dropdown from the nav bar during runtime
                        // i.e. upon hash navigation
                        this.removeDropdown = function(dropdownId){

                            // get a reference to the target dropdown
                            var menuArray = $scope.registeredMenus.filter(function (el){
                                return el.uicId == dropdownId;
                            });
                            var dropdown = menuArray[0];

                            // remove and destroy it and all children
                            uicDropdownService.remove(dropdown);
                            dropdown.iElement.remove();
                            dropdown.$destroy();
                        };

                            // check for single or array of dropdowns to add
                        // available on scope for additional invokation flexability
                        $scope.addOrRemove = function(dropdowns, action){
                            action = action + 'Dropdown';
                            if(angular.isArray(dropdowns)){
                                angular.forEach(dropdowns, function(dropdown){
                                    that[action](dropdown);
                                });
                            }else{
                                that[action](dropdowns);
                            }
                        };


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

                        // handle request to add dropdown(s)
                        // obj = menu JSON obj or array of objs
                        $scope.$on('add-nav-dropdowns', function(evt, obj){
                            $scope.addOrRemove(obj, 'add');
                        });

                        // handle request to remove dropdown(s)
                        // ids = string or array of strings matching dd titles
                        $scope.$on('remove-nav-dropdowns', function(evt, ids){
                            $scope.addOrRemove(ids, 'remove');
                        });

                            // listen for dropdown open event
                        $scope.$on('dropdown-opened', function(evt, targetScope){

                            // perform an action when a child dropdown is opened
                            $log.log('dropdown-opened', targetScope);
                        });

                        // listen for dropdown close event
                        $scope.$on('dropdown-closed', function(evt, targetScope){

                            // perform an action when a child dropdown is closed
                            $log.log('dropdown-closed', targetScope);
                        });

                        // listen for menu item event
                        $scope.$on('menu-item-selected', function(evt, scope){
                            // grab the url string from the menu iten scope
                            var url;
                            try{
                                url = scope.url || scope.item.url;
                                // handle navigation programatically
                                //$location.path(url);
                                $log.log(url);
                            }catch(err){
                                $log.warn('no url');
                            }
                        });
                    }],
                    link: function(scope, iElement, iAttrs, navCtrl, $transclude){

                        // know who the tenants are
                        // note that this link function executes *after*
                        // the link functions of any inner components
                        // at this point we could extend our NavBar component
                        // functionality to rebuild menus based on new json or
                        // disable individual menu items based on $location
                        scope.registeredMenus = uicDropdownService.getDropdowns();

                        // Attr API option for sticky vs fixed
                        scope.position = (iAttrs.sticky == 'true') ? 'navbar-fixed-top' : 'navbar-static-top';

                        // get theme css class from attr API if set
                        scope.theme = (iAttrs.theme) ? iAttrs.theme : null;

                        // send compiled/linked element back to ctrl instance
                        navCtrl.init( iElement );
                    }
                };
            }]);
})();





(function(){
    'use strict';

    var tpl = '';
    tpl = '<a ng-class="bttnClass"' +
    '   ng-click="doSomething(this);debug()">' +
    '    {{bttnText}}' +
    '    <span ng-transclude></span>' +
    '</a>';

    var buttons = angular.module('uiComponents.smartButton', []);

    buttons.directive('smartButton', ['$timeout', function($timeout){
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



