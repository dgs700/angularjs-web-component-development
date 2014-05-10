// Unit test coverage for the NavBar UI container
describe('My NavBar component directive', function () {
    var $compile, $rootScope, $scope, $element,
        element, $event, $_uicNavBarService;

    // manually initialize our component library module
    beforeEach(module('uiComponents.navbar'));

    // make the necessary angular utility methods available
    // to our tests
    beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;

        // note that this is actually the PARENT scope of the directive
        $scope = $rootScope.$new();
    }));

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

    var tpl2 =
        '<uic-nav-bar' +
        '  minimal="true"' +
        '  home-url="http://www.david-shapiro.net"' +
        '  sticky="false"' +
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

    var tplJSON =
        '<uic-nav-bar' +
        '  minimal="false"' +
        '  home-url="http://www.david-shapiro.net"' +
        '  sticky="true">' +
        '</uic-nav-bar>';

    // some fake JSON
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
        beforeEach(function () {
        });
        describe('configuration defauts', function () {
            beforeEach(function () {
            });
            it('should show all contents if API attribute "minimal" is not true', function () {
            });
            it('should set the brand logo URL to the API attribute "home-url"', function () {
            });
            it('should fix position the nav bar if API attribute "sticky" is true', function () {
            });
            it('should contain dropdowns and menu components included as inner html', function () {
            });
        });
        describe('configuration API alternatives', function () {
            beforeEach(function () {
            });
            it('should hide all contents if API attribute "minimal" is true', function () {
            });
            it('should static position the nav bar if API attribute "sticky" is not true', function () {
            });
            it('should add a styling theme class name if API attribute "theme" equals "class name"', function () {
            });
        });
        describe('configuration API via JSON', function () {
            beforeEach(function () {
            });
            it('should contain dropdowns and menu components provided as JSON', function () {
            });
        });
    });
    describe('Runtime event APIs', function () {
        beforeEach(function () {
        });
        it('should hide contents on "header-minimize"', function () {
        });
        it('should show contents on "header-maximize"', function () {
        });
        it('should add a dropdown on "add-nav-dropdowns"', function () {
        });
        it('should remove a dropdown on "remove-nav-dropdowns"', function () {
        });
        it('should log dropdown-opened on "dropdown-opened"', function () {
        });
        it('should log dropdown-closed on "dropdown-closed"', function () {
        });
        it('should log the URL on "menu-item-selected"', function () {
        });
    });
});