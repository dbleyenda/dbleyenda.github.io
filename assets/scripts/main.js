// Filename: main.js

require.config({
	paths: {
		jquery: '../../vendor/scripts/jquery/jquery.min',
		bootstrap: '../../vendor/scripts/bootstrap/bootstrap.min',
		underscore: '../../vendor/scripts/underscore/underscore.min',
		backbone: '../../vendor/scripts/backbone/backbone.min',
		backbone_epoxy: '../../vendor/scripts/backbone.epoxy/backbone.epoxy.min',
		backbone_validation: '../../vendor/scripts/backbone.validation/backbone.validation.min',
		firebase: '../../vendor/scripts/firebase/firebase',
		backbonefire: '../../vendor/scripts/backbonefire/backbonefire',
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