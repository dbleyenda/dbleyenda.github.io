// Filename: main.js

require.config({
	paths: {
		jquery: '../../vendor/jquery/jquery.min',
		bootstrap: '../../vendor/bootstrap/js/bootstrap.min',
		underscore: '../../vendor/underscore/underscore.min',
		backbone: '../../vendor/backbone/backbone.min',
		backbone_epoxy: '../../vendor/backbone.epoxy/backbone.epoxy.min',
		backbone_validation: '../../vendor/backbone.validation/backbone.validation.min',
		firebase: '../../vendor/firebase/firebase',
		backbonefire: '../../vendor/backbonefire/backbonefire',
		templates: '../../templates'
	}
});

require([

	// Load our app module and pass it to our definition function
	'app',
], function(App){
	// The "app" dependency is passed in as "App"
	App.initialize();
});