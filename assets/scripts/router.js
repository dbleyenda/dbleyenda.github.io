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

			// edit Question
			'edit/:id': 'editQuestion',
			
			// Default - Game
			'*actions': 'defaultAction'
		},

	});

	var initialize = function(){
		
		var app_router = new AppRouter;

		var currentView = null;

		var showView = function(view) {
			if(currentView != null){
				currentView.close();
			}
			currentView = view;
			return view;
		};
		
		// List Questions
		app_router.on('route:listQuestions', function(){
			var listView = showView( new ListView() );
		});

		// Add Question
		app_router.on('route:addQuestion', function(){
			var addView = showView( new AddView() );
		});

		// Edit Question
		app_router.on('route:editQuestion', function(id){
			var editView = showView( new AddView({ id: id }) );
		});

		// Default
		app_router.on('route:defaultAction', function(actions){
			var gameView = showView( new GameView() );
		});

		// Footer
		var footerView = new FooterView();

		Backbone.history.start();

	};

	return {
		initialize: initialize
	};

});