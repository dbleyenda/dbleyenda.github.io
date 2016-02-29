// Filename: views/admin/login/LoginView
define([
	'jquery',
	'underscore',
	'backbone',
	'models/admin/login/LoginModel',
	'text!templates/admin/login/loginTemplate.html',
	'firebase',
	'bootstrap',
	'backbone_epoxy',
	'backbone_validation',
], function($, _, Backbone, LoginModel, loginTemplate){

	var LoginView = Backbone.Epoxy.View.extend({

		el: "#id_sectionContainer",

		events: {
			'click #id_loginSubmit': 'onSubmitButtonClicked'
		},

		initialize: function(options){

			// Create user
			// // lo dejo comentado por si se necesita crear un usuario.
			// var ref = new Firebase("https://luminous-inferno-7458.firebaseio.com/");
			// ref.createUser({
			// 	email: "email@email.com",
			// 	password: "1234"
			// }, function(error, userData) {
			// 	if(error){
			// 		console.log("Error creating user:", error);
			// 	}else{
			// 		console.log("Successfully created user account with uid:", userData.uid);
			// 	}
			// });

			// Hide Loading
			this.mask('#id_loadingMask', 'hide');

			// Init Model
			this.model = new LoginModel;

			// Bind model validation to view
			Backbone.Validation.bind(this);	

			// render
			this.render();

		},

		render: function(){

			// Compile template
			var compiledTemplate = _.template( loginTemplate );

			// Render template
			this.$el.html( compiledTemplate(this.model.toJSON()) );

			// Bind custom model validation callbacks
			Backbone.Validation.bind(this, {
				valid: _.bind(function (view, attr, selector) {
					this.setIndividualError(view.$('[name=' + attr + ']'), attr, '');
				}, this),
				invalid: _.bind(function (view, attr, error, selector) {
					this.setIndividualError(view.$('[name=' + attr + ']'), attr, error);
				}, this),
			});

		},

		onSubmitButtonClicked: function(){

			if(this.model.isValid(true)){

				// Show Loading
				this.mask('#id_loadingMask', 'show');

				var ref = new Firebase("https://luminous-inferno-7458.firebaseio.com/");
				ref.authWithPassword(this.model.toJSON(), _.bind(function(error, authData) {
					
					// Hide Loading
					this.mask('#id_loadingMask', 'hide');

					if(error){
						console.log("Login Failed!", error);
						alert( 'E-mail o contraseña invalidos.\nPor favor intente de nuevo.' );
					}else {
						//console.log("Authenticated successfully with payload:", authData);

						// localStorage authData
						window.localStorage.setItem('userData',JSON.stringify(authData));
						
						// Navigate to list
						Backbone.history.navigate('#/admin/list', {trigger: true});
					}
				}, this));

			}
		},

		setIndividualError: function(element, name, error){

			// If not valid
			if( error != ''){
				element.parents('.form-group').addClass('has-error');
				element.next('p.text-danger').remove();
				element.after('<p class="text-danger">'+error+'</p>');

			// If valid
			}else{
				element.parents('.form-group').removeClass('has-error');
				element.next('p.text-danger').remove();
			}

		},

		mask: function(id, action){
			if( action == 'show' ){
				$(id).css('display','table');
			}else if( action == 'hide' ){
				$(id).css('display','none');
			}
		},

		close: function(){
			this.destroy();
		},

		destroy: function(){

			// UndelegateEvents
			this.undelegateEvents();

			// TODO checkear como remover la view

		}

	});

	return LoginView;

});