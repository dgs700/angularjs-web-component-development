// Unit test coverage for the NavBar UI container
describe('My NavBar component directive', function () {
    var $compile, $rootScope, $scope, $element,
        element, $event, $_uicNavBarService, $log;

    // create some HTML to simulate how a developer might include
    // our menu item component in their page that covers all of
    // the API options
    var tpl =
        '<uic-nav-bar' +
        '  minimal="false"' +
        '  home-url="http://www.david-shapiro.net"' +
        '  sticky="true"' +
        '  theme="default">' +
        '  <uic-dropdown-menu' +
        '    text="Another DD"' +
        '    >' +
        '    <uic-menu-item' +
        '        text="First Item"' +
        '        url="http://david--shapiro.blogspot.com/"' +
        '    >' +
        '  </uic-dropdown-menu>' +
        '  <uic-menu-item' +
        '    text="Link Only"' +
        '    url="http://david--shapiro.blogspot.com/"' +
        '  ></uic-menu-item>' +
        '</uic-nav-bar>';

    // this tpl has some attr API values set to non-defaults
    var tpl2 =
        '<uic-nav-bar' +
        '  minimal="true"' +
        '  home-url="http://www.david-shapiro.net"' +
        '  sticky="false"' +
        '  theme="light-blue">' +
        '  <uic-dropdown-menu' +
        '    text="Another DD"' +
        '    >' +
        '    <uic-menu-item' +
        '        text="First Item"' +
        '        url="http://david--shapiro.blogspot.com/"' +
        '    >' +
        '  </uic-dropdown-menu>' +
        '  <uic-menu-item' +
        '    text="Link Only"' +
        '    url="http://david--shapiro.blogspot.com/"' +
        '  ></uic-menu-item>' +
        '</uic-nav-bar>';

    // tpl with no HTML contents for testing JSON population
    var tplJson =
        '<uic-nav-bar' +
        '  minimal="false"' +
        '  home-url="http://www.david-shapiro.net"' +
        '  sticky="true">' +
        '</uic-nav-bar>';

    // an array of dropdowns
    var header = [
        {"Products":[
            {
                "text":"Scrum Manager",
                "url":"/products/scrum-manager"
            },{
                "text":"AppBeat",
                "url":"/products/app-beat"
            },{
                "text":"Solidify on Request",
                "url":"/products/sor"
            },{
                "text":"IQ Everywhere",
                "url":"/products/iq-anywhere"
            },{
                "text":"Service Everywhere",
                "url":"/products/service-everywhere"
            }
        ]},
        {"Company":[
            {
                "text":"Contact Us",
                "url":"/company/contact"
            },{
                "text":"Jobs",
                "url":"/company/jobs"
            },{
                "text":"Privacy Statement",
                "url":"/company/privacy"
            },{
                "text":"Terms of Use",
                "url":"/company/terms"
            }]
        }
    ];

    // a single dropdown object
    var dropdown = {"About Us":[
        {
            "text":"Contact Us",
            "url":"/company/contact"
        },{
            "text":"Jobs",
            "url":"/company/jobs"
        },{
            "text":"Privacy Statement",
            "url":"/company/privacy"
        },{
            "text":"Terms of Use",
            "url":"/company/terms"
        }]
    };

    // manually initialize our component library module
    beforeEach(module('uiComponents.navbar'));

    // make the necessary angular utility methods available
    // to our tests
    beforeEach(inject(function (_$compile_, _$rootScope_, _$log_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $log = _$log_;
        // note that this is actually the PARENT scope of the directive
        $scope = $rootScope.$new();
    }));

    // manually compile and link our component directive
    function compileDirective(directiveTpl) {

        // use our default template if none provided
        if (!directiveTpl) directiveTpl = tpl;

        inject(function($compile) {

            // manually compile the template and inject the scope in
            $element = $compile(directiveTpl)($scope);

            // manually update all of the bindings
            $scope.$digest();

            // make the html output available to our tests
            element = $element.html();
        });
    }

    describe('NavBar component configuration APIs', function () {

        describe('configuration defauts', function () {

            beforeEach(function () {
                compileDirective();
            });

            it('should show all contents if API attribute "minimal" is not true',
                function () {
                // .ng-hide will be set on hidden menu groups
                expect($element.find('ul.ng-hide').length).toBe(0);
            });

            it('should set the brand logo URL to the API attribute "home-url"',
                function () {
                expect($element.find('a.navbar-brand').attr('href'))
                    .toContain('www.david-shapiro.net');
            });

            it('should fix position the nav bar if API attribute "sticky" is true',
                function () {

                // can only determine that the "navbar-fixed-top" class is set
                expect($element.hasClass('navbar-fixed-top')).toBe(true);
            });

            it('should contain dropdowns and menu components as inner html',
                function () {

                //there are 2 menu items and 1 dropdown in this test template
                expect($element.find('li.uic-menu-item').length).toBe(2);
                expect($element.find('li.uic-dropdown').length).toBe(1);
            });
        });

        describe('configuration API alternatives', function () {

            beforeEach(function () {
                // now we are using the second test template
                compileDirective(tpl2);
            });

            it('should hide all contents if API attribute "minimal" is true',
                function () {
                // the 2 <ul> elements should now have .ng-hide set
                expect($element.find('ul.ng-hide').length).toBe(2);
            });

            it('should static position the navbar if API attr "sticky" is falsy',
                function () {

                // can only determine that the "navbar-static-top" class is set
                expect($element.hasClass('navbar-static-top')).toBe(true);
            });

            it('should add a style theme class if API attr "theme" equals "classname"',
                function () {

                // the "light-blue" attr val should be added as a class
                // on the root element
                expect($element.hasClass('light-blue')).toBe(true);
            });
        });

        describe('configuration API via JSON', function () {

            beforeEach(inject(function (uicNavBarService) {
                $_uicNavBarService = uicNavBarService;

                // manually add menu data to the nav bar service
                $_uicNavBarService.addMenus(header);

                compileDirective(tplJson);
            }));

            it('should contain dropdowns and menu components provided as JSON',
                function () {

                // there are 9 total menu items in the test data
                expect($element.find('li.uic-dropdown > ul > li').length).toBe(9);
            });
        });
    });

    describe('Runtime event APIs', function () {

        var scope;
        beforeEach(inject(function (uicNavBarService) {
            $_uicNavBarService = uicNavBarService;

            // manually add menu data to the nav bar service
            $_uicNavBarService.addMenus(header);

            compileDirective(tplJson);

            // get access to the actual controller instance
            scope = $element.isolateScope();

            // create a fake click event
            $event = $.Event( "click" );
        }));

        it('should hide contents on "header-minimize"', function () {

            // default state is to show all contents
            expect($element.find('ul.ng-hide').length).toBe(0);
            $rootScope.$broadcast('header-minimize');
            scope.$digest();

            // both template <ul>s should now have .ng-hide set
            expect($element.find('ul.ng-hide').length).toBe(2);
        });

        it('should show contents on "header-maximize"', function () {

            // first we need to explicitly hide contents since that
            // is not the default
            $rootScope.$broadcast('header-minimize');
            scope.$digest();
            expect($element.find('ul.ng-hide').length).toBe(2);

            // now broadcast the API event
            $rootScope.$broadcast('header-maximize');
            scope.$digest();

            // .ng-hide should now be removed
            expect($element.find('ul.ng-hide').length).toBe(0);
        });

        it('should add a dropdown on "add-nav-dropdowns"', function () {

            // upon initialization there should be 2 dropdowns with
            // 9 menu items total
            expect($element.find('li.uic-dropdown').length).toBe(2);
            expect($element.find('li.uic-dropdown > ul > li').length).toBe(9);

            // broadcast the API event with data
            $rootScope.$broadcast('add-nav-dropdowns', dropdown);
            scope.$digest();

            // now there should be 3 dropdowns and 13 menu items
            expect($element.find('li.uic-dropdown').length).toBe(3);
            expect($element.find('li.uic-dropdown > ul > li').length).toBe(13);
        });

        it('should remove a dropdown on "remove-nav-dropdowns"', function () {

            // upon initialization there should be 2 dropdowns with
            // 9 menu items total
            expect($element.find('li.uic-dropdown').length).toBe(2);
            expect($element.find('li.uic-dropdown > ul > li').length).toBe(9);

            // broadcast the API event with data
            $rootScope.$broadcast('remove-nav-dropdowns', 'Products');
            scope.$digest();

            // now there should be 1 dropdowns with 4 menu items
            expect($element.find('li.uic-dropdown').length).toBe(1);
            expect($element.find('li.uic-dropdown > ul > li').length).toBe(4);
        });

        it('should log dropdown-opened on "dropdown-opened"', function () {
            spyOn($log, 'log');

            // grab a reference to a dropdown and its scope
            var elem = $element.find('li.uic-dropdown > a');
            var targetScope = elem.isolateScope();

            // simulate opening it
            elem.trigger('click');

            // make sure the event handler gets the correct scope reference
            expect($log.log).toHaveBeenCalledWith('dropdown-opened', targetScope);
        });

        it('should log dropdown-closed on "dropdown-closed"', function () {
            spyOn($log, 'log');

            // grab a reference to a dropdown and its scope
            var elem = $element.find('li.uic-dropdown > a').last();
            var targetScope = elem.isolateScope();

            // open the dropdown
            elem.trigger('click');
            // then close it again
            elem.trigger('click');

            // make sure the event handler gets the correct scope reference
            expect($log.log).toHaveBeenCalledWith('dropdown-closed', targetScope);
        });

        it('should log the URL on "menu-item-selected"', function () {
            spyOn($log, 'log');

            // get a menu item reference plus scope and url if any
            var menuItem = $element.find('li.uic-dropdown > ul > li');
            var itemScope = menuItem.scope();
            var url = itemScope.item.url;

            // manually $emit a menu-item-selected event
            itemScope.selected($event, itemScope);

            // only testing menu items w/ urls since those without should
            // be selectable anyhow
            if(url) expect($log.log).toHaveBeenCalledWith(url);
        });
    });
});