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

		currentView: null,
		loggedIn: false,

		routes: {

			// Admin - Log in
			'login': 'listQuestions',
			'admin': 'listQuestions',
			'admin/login': 'listQuestions',

			// Admin - Log out
			'admin/logout': 'logout',
			'logout': 'logout',

			// Admin - List Questions
			'admin/list': 'listQuestions',

			// Admin - Add Question
			'admin/add': 'addQuestion',

			// Admin - edit Question
			'admin/edit/:id': 'editQuestion',
			
			// Default - Game
			'*actions': 'defaultAction'
		},

		initialize: function(){
				
			// Log out
			this.on('route:logout', function(){
				this.loggedIn = false;
				//window.localStorage.removeItem('userData');
				delete window.localStorage['userData'];
				Backbone.history.navigate('#', {trigger: true});
			});

			// List Questions / Log In
			this.on('route:listQuestions', function(){
				var userData = this.checkLogin();
				if( userData ){
					var addView = this.showView( new ListView({
						userData: userData
					}) );
				}
			});

			// Add Question
			this.on('route:addQuestion', function(){
				var userData = this.checkLogin();
				if( userData ){
					var addView = this.showView( new AddView({
						userData: userData
					}) );
				}
			});

			// Edit Question
			this.on('route:editQuestion', function(id){
				var userData = this.checkLogin();
				if( userData ){
					var editView = this.showView( new AddView({ 
						id: id,
						userData: userData
					}) );
				}
			});

			// Default
			this.on('route:defaultAction', function(actions){
				var gameView = this.showView( new GameView() );
			});

			// Footer
			var footerView = new FooterView();

			Backbone.history.start();

		},

		showView: function(view) {
			if(this.currentView != null){
				this.currentView.close();
			}
			this.currentView = view;
			return view;
		},

		checkLogin: function(){

			try {
				var userData = JSON.parse(window.localStorage.getItem('userData'));
			} catch (e) {
				// Nothing for now
				console.log('not logged in!');
			}

			// for ( var i = 0, len = localStorage.length; i < len; ++i ) {
			//	 console.log( localStorage.getItem( localStorage.key( i ) ) );
			// }

			// Check if userData is on localStorage
			if( !_.isUndefined( userData ) ){
				this.loggedIn = userData;
				console.log(userData);
			}

			if( !this.loggedIn ){
				var loginView = this.showView( new LoginView() );
				return false;
			}else{
				return userData;
			}
		}

	});

	return AppRouter;

});