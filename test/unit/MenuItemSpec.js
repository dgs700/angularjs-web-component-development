describe('My MenuItem component directive', function () {
    var $compile, $rootScope, $scope, $element, element, $event;
    // manually initialize our component library module
    beforeEach(module('UIComponents'));
    // make the necessary angular utility methods available
    // to our tests
    beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        // note that this is actually the PARENT scope of the directive
        $scope = $rootScope.$new();
    }));

    // create some HTML to simulate how a developer might include
    // our smart button component in their page that covers all of
    // the API options
    var tpl = '<uic-menu-item text="First Item" url="http://david--shapiro.blogspot.com/"></uic-menu-item>';

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
    // test our component APIs
    describe('Menu Item Component API', function(){
        var scope;
        beforeEach(function(){
            compileDirective();
            // get access to the actual controller instance
            scope = $element.data('$scope').$$childHead;
            $event = $.Event( "click" );
        });
        it('should use the attr value (API) of "text" as the menu label', function(){
            expect(element).toContain("First Item");
        });
        it('should use the attr value (API) of "url" for the href url', function(){
            expect(element).toContain("http://david--shapiro.blogspot.com/");
        });
        it('should emit a "menu-item-selected" event (API) as when selected', function(){
            spyOn(scope, '$emit');
            scope.selected($event, scope);
            expect(scope.$emit).toHaveBeenCalledWith('menu-item-selected', scope);
        });
    });
});
