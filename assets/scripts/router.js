// Filename: router.js
define([
	'jquery',
	'underscore',
	'backbone',
	'views/game/GameView',
	'views/admin/login/LoginView',
	'views/admin/add/AddView',
	'views/admin/list/ListView',
	'views/FooterView'
], function($, _, Backbone, GameView, LoginView, AddView, ListView, FooterView){

	var AppRouter = Backbone.Router.extend({

		routes: {

			// Admin - Log in
			'admin': 'listQuestions',

			// Admin - List Questions
			'admin/list': 'listQuestions',

			// Admin - Add Question
			'admin/add': 'addQuestion',

			// Admin - edit Question
			'admin/edit/:id': 'editQuestion',
			
			// Default - Game
			'*actions': 'defaultAction'
		},

		// execute: function(callback, args){

		// 	// Do what you want here! 
		// 	if (callback) callback.apply(this, args);
		// }

	});

	var initialize = function(){
		
		var app_router = new AppRouter;

		var currentView = null;

		var loggedIn = false;

		var showView = function(view) {
			if(currentView != null){
				currentView.close();
			}
			currentView = view;
			return view;
		};

		var checkLogin = function(){
			if( !loggedIn ){
				var loginView = showView( new LoginView() );
				return false;
			}else{
				return true;
			}
		}
		
		// List Questions / Log In
		app_router.on('route:listQuestions', function(){
			if( checkLogin() ){
				var listView = showView( new ListView() );
			}
		});

		// Add Question
		app_router.on('route:addQuestion', function(){
			if( checkLogin() ){
				var addView = showView( new AddView() );
			}
		});

		// Edit Question
		app_router.on('route:editQuestion', function(id){
			if( checkLogin() ){
				var editView = showView( new AddView({ id: id }) );
			}
		});

		// Default
		app_router.on('route:defaultAction', function(actions){
			console.log('defaultAction');
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