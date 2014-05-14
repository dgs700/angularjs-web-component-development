// Unit test coverage for the Dropdown UI component
describe('My Dropdown component directive', function () {
    var $compile, $rootScope, $scope, $element, element, $event, $_uicDropdownService;

    // manually initialize our component library module
    beforeEach(module('uiComponents.dropdown'));

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
        '<uic-dropdown-menu text="Custom Dropdown">' +
        '  <uic-menu-item text="Second Item" url="http://google.com/">' +
        '  </uic-menu-item>' +
        '  <uic-menu-item text="No Url" url=""></uic-menu-item>' +
        '</uic-dropdown-menu>';

    // template whose contents will be generated
    // with JSON data
    var tplJson = '<uic-dropdown-menu></uic-dropdown-menu>';

    // some fake JSON
    var menu = {"Company":[
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

    // test our component  APIs
    describe('Dropdown Component markup API coverage', function(){
        var scope;
        beforeEach(function(){
            compileDirective();

            // get access to the actual controller instance
            scope = $element.isolateScope();

            // create a fake click event
            $event = $.Event( "click" );
        });

        it('should use the attr value (API) of "text" as the dropdown label', function(){
            expect(element).toContain("Custom Dropdown");
        });

        it('should transclude the 2 menu item components (API)', function(){
            expect($element.find('li').length).toBe(2);
        });

        it('should toggle open state when clicked', function(){
            spyOn(scope, '$emit');
            scope.isOpen = false;

            // click on the dropdown to OPEN
            $element.find('a').trigger('click');
            expect(scope.isOpen).toBe(true);
            expect(scope.$emit).toHaveBeenCalledWith('dropdown-opened');

            // click on the dropdown to CLOSE
            $element.find('a').trigger('click');
            expect(scope.isOpen).toBe(false);
            expect(scope.$emit).toHaveBeenCalledWith('dropdown-closed');
        });
    });

    // test JSON constructed dropdowns
    describe('Dropdown Component JSON API coverage', function(){
        var scope;
        beforeEach(function(){
            $scope.$parent.menu = menu;
            compileDirective(tplJson);
            scope = $element.isolateScope();
        });

        it('should get its title text from the menu JSON obj key', function(){
            expect(scope.dropdownTitle).toContain("Company");
        });

        it('should know that it is using JSON data for rendering', function(){
            expect(scope.jsonData).toBe(true);
        });

        it('should render the correct number of menu items (4)', function(){
            expect($element.find('li').length).toBe(4);
        });

        // coverage for other service methods not covered above
        describe('Dropdown Service methods', function(){

            // create another scope so there is more than one
            var anotherScope;

            // get an explicit reference to the dropdown service
            beforeEach(inject(function (uicDropdownService) {
                $_uicDropdownService = uicDropdownService;
                anotherScope = $element.isolateScope();
                $_uicDropdownService.register(anotherScope);
            }));

            it('should now have 2 registered dropdowns', function(){
                // covers .register() and .getDropdowns() methods
                expect($_uicDropdownService.getDropdowns().length).toBe(2);
            });

            it('should retrieve a dropdown by id', function(){
                var testScope = $_uicDropdownService.getById(anotherScope.$id);
                expect(testScope).toBe(anotherScope);
            });
        });
    });
});