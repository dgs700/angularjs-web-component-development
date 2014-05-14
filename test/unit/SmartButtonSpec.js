describe('My SmartButton component directive', function () {
    var $compile, $rootScope, $scope, $element, element;
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
    var tpl = '<smart-button default-text="A Very Smart Button" '
        + 'active-text="Wait for 5 seconds..." '
        + 'debug="showAlert(\'a value on the $rootScope\')"'
        + '>{{bttnText}} Text from transclusion.</smart-button>';

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
    describe('A smart button API', function(){
        var scope;
        beforeEach(function(){
            compileDirective();
            // get access to the actual controller instance
            scope = $element.isolateScope();
            spyOn($rootScope, '$broadcast').andCallThrough();
        });
        it('should use the attr value of "default-text" as the initially displayed bttn text', function(){
            expect(element).toContain('A Very Smart Button');
        });
        it('should use the attr value of "active-text" as what to display when clicked', function(){
            expect(scope.bttnText).toBe('A Very Smart Button');
            scope.doSomething();
            expect(scope.bttnText).toBe('Wait for 5 seconds...');
        });
        it('should transclude the content of the element', function(){
            expect(element).toContain('Text from transclusion.');
        });
        it('should have the injected logic available for execution', function(){
            expect(scope.debug()).toBe('a value on the $rootScope');
        });
        it('should emit any events as APIs', function(){
            spyOn(scope, '$emit');
            scope.$emit('smart-button-click');
            expect(scope.$emit).toHaveBeenCalledWith('smart-button-click');
        });
        it('should listen and handle any events as APIs', function(){
            $rootScope.$broadcast('smart-button-command', scope.$id, {setClass: 'btn-warning'});
            expect(scope.bttnClass).toContain('btn-warning');
        });
    });
});