// Filename: router.js
define([
	'jquery',
	'underscore',
	'backbone',
	'views/game/GameView',
	'views/admin/add/AddView',
	'views/admin/list/ListView',
	'views/FooterView'
], function($, _, Backbone, GameView, AddView, ListView, FooterView){

	var AppRouter = Backbone.Router.extend({
		routes: {
			// List Questions
			'list': 'listQuestions',

			// Add Question
			'add': 'addQuestion',
			
			// Default - Game
			'*actions': 'defaultAction'
		}
	  });

	var initialize = function(){
		
		var app_router = new AppRouter;
		
		// List Questions
		app_router.on('route:listQuestions', function(){
			var listView = new ListView();
		});

		// Add Question
		app_router.on('route:addQuestion', function(){
			var addView = new AddView();
		});

		// Default
		app_router.on('route:defaultAction', function(actions){
			var gameView = new GameView();
		});

		// Footer
		var footerView = new FooterView();

		Backbone.history.start();

	};

	return {
		initialize: initialize
	};

});