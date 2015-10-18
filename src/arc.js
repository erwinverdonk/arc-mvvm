(function () {
	'use strict';

	angular.module = function(module, name, requires, configFn){
		var argumentsArray = Array.prototype.slice.call(arguments);
		argumentsArray.splice(0, 1);

		var moduleInstance = module.apply(module, argumentsArray);

		angular.extend(moduleInstance, {
			component: component,
			decorator: decorator,
			model: model
		});

		return moduleInstance;

		function component(name, options){
			moduleInstance.directive(name, function(){
				return {
					restrict: 'E', // Component can only be used as element.
					priority: options.priority || 0,
					scope: options.bindToModel, // Isolated Scope
					controller: options.model,
					bindToController: true,

					templateUrl: function(element, attrs){
						return attrs.view || options.view;
					},

					link: function(scope, element, attrs, ctrl){
						var argumentsArray = Array.prototype.slice.call(arguments);
						var originalDigestFn = scope.$digest.bind(scope);

						// We do not want the parent scope to be accessible.
						scope.$parent = scope.$root;

						// Prevent $digest to throw error when called while already in progress.
						scope.$digest = function(){
							try {
								originalDigestFn();
							} catch(e) {
								console.debug('$digest already in progress. Call to $digest ignored.');
							}
						};

						// Replace 'ctrl' argument with the 'scope', since
						// the isolated scope is used as controller.
						argumentsArray[3] = argumentsArray[0];

						// Strip the scope from the directive, since
						// the we should not expose the scope and the angular scope.
						argumentsArray.splice(0, 1);

						// Execute the actual link function.
						options.viewModel.apply(options.viewModel, argumentsArray);
					}
				};
			});

			return moduleInstance;
		}

		function decorator(name, options){
			moduleInstance.directive(name, function(){
				return {
					restrict: 'A', // Decorator can only be used as attribute.
					priority: options.priority || 0,

					link: function(scope, element, attrs, ctrl){
						var argumentsArray = Array.prototype.slice.call(arguments);
						var isolateScope = element.isolateScope();
						var originalDigestFn = scope.$digest.bind(scope);

						// Prevent $digest to throw error when called while already in progress.
						scope.$digest = function(){
							try {
								originalDigestFn();
							} catch(e) {
								console.debug('$digest already in progress. Call to $digest ignored.');
							}
						};

						// The isolated scope is used as host controller, so incorporate the
						// actual controller into the isolated scope.
						angular.extend(isolateScope, ctrl);

						// Add the host controller as fourth argument.
						argumentsArray[4] = isolateScope;

						// Strip the scope from the directive, since we
						// should not expose the scope.
						argumentsArray.splice(0, 1);

						// Execute the actual link function.
						options.viewModel.apply(options.viewModel, argumentsArray);
					},
					controller: options.model,
					bindToController: options.bindToModel || true
				};
			});

			return moduleInstance;
		}

		function model(name, _model){
			// Wrap a function around the controller to bind to the correct scope and
			// to incorporate the controller into the scope.

			moduleInstance.controller(name, /*@ngInject*/ function($scope, $injector){
				$injector.invoke(_model, $scope);
			});

			return moduleInstance;
		}
	}.bind(angular.module, angular.module.bind(angular.module));
})();