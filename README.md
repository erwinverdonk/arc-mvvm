# arc-mvvm
A MVVM (Model View ViewModel) workflow approach for AngularJS to guide developers into creating robust and reusable Web Components and free them from the ng-controller and $scope pitfalls. 

## Usage

Create a web component
```js
(function () {
	'use strict';

	angular.module('myModule')
		.component('myComponent', {
			model: 'MyComponentModel',
			view: 'components/my-component/my-component.html',
			viewModel: viewModel,
			bindToModel: {
				data: '=?'
			}
		}
	);

	/**
	 * View Model
	 * @param {Object} element The DOM element linked to this component.
	 * @param {Object} attrs The attributes set on the DOM element.
	 * @param {Object} model The model of the component.
	 */
	function viewModel(element, attrs, model) {
		// Presentation Logic (event handlers, dom manipulation, etc)
	}
})();
```

Create a model
```js
(function () {
  'use strict';

  angular.module('myModule')
    .model('MyComponentModel', MyComponentModel);

	// The model should not contain any presentation logic.
	// You should see the model as an API that can be used without an user interface.
	function MyComponentModel() {
		// Determine what is public to the view.
		angular.extend(this, {
			data: data,
			performSomeAction: performSomeAction
		});
    
		var data: [];
    
		function performSomeAction(){
			// ...
		}
    
		function _validateContext(){
			// ...
		}
	}
})();
```

Create a decorator
```js
(function () {
	'use strict';

	angular.module('myModule')
		.decorator('myDecorator', {
			// For decorators the priority should always be lower than the priority of the component.
			priority: -1, 
			viewModel: viewModel,
			model: 'MyDecoratorModel'
		}
	);

	/**
	 * View Model
	 * @param {Object} element The DOM element linked to this decorator.
	 * @param {Object} attrs The attributes set on the DOM element.
	 * @param {Object} model The model of the decorator.
	 * @param {Object} hostModel The model of the host component.
	 */
	function viewModel(element, attrs, model, hostModel) {
		// Presentation Logic (event handlers, dom manipulation, etc)
	}
})();
```

Use a web component
```html
<my-component data="{{specificData}}"></my-component>
```

Use a web component with decorator
```html
<my-component my-decorator data="{{specificData}}"></my-component>
```
