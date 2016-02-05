// Filename: router.js
define([
	'jquery',
	'underscore',
	'backbone',
	'views/game/GameView',
	'views/admin/AdminView',
	'views/FooterView'
], function($, _, Backbone, GameView, AdminView, FooterView){

	var AppRouter = Backbone.Router.extend({
		routes: {
			// Admin
			'admin': 'showAdmin',
			
			// Default - Game
			'*actions': 'defaultAction'
		}
	  });

	var initialize = function(){
		
		var app_router = new AppRouter;
		
		// Admin
		app_router.on('route:showAdmin', function(){
			var adminView = new AdminView();
			//adminView.render();
		});

		// Default
		app_router.on('route:defaultAction', function(actions){
			var gameView = new GameView();
			//gameView.render();
		});

		// Footer
		var footerView = new FooterView();

		Backbone.history.start();

	};

	return {
		initialize: initialize
	};

});