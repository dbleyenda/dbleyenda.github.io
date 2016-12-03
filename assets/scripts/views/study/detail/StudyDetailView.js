// Filename: views/study/detail/StudyDetailView
define([
	'jquery',
	'underscore',
	'backbone',
	'models/QuestionModel',
	'text!templates/study/detail/StudyDetailTemplate.html',
	'firebase',
	'bootstrap',
], function($, _, Backbone, QuestionModel, detailTemplate){

	var StudyDetailView = Backbone.View.extend({

		el: "#id_sectionContainer",

		events: {
			'click .pagination .btn': 'goToPage',
		},

		initialize: function(options){

			// Toggle footer nav link
			$('#footer-nav .study').hide();
			$('#footer-nav .game').show();

			// Show Loading
			this.mask('#id_loadingMask', 'show');

			// Init model
			this.model = new QuestionModel;

			this.actualID = options.id;

			// Bind model validation to view
			Backbone.Validation.bind(this);	

			// Get All answers
			this.ref = new Firebase("https://luminous-inferno-7458.firebaseio.com/answers/"+options.id+"/");

			this.ref.once("value", _.bind(function(snapshot) {

				// Set values
				this.model.set( snapshot.val() );

				// Hide Loading
				this.mask('#id_loadingMask', 'hide');

				// Prepare lists items
				this.prepareListItems();

				// Set Pagination
				this.setPagination();

				// Render
				this.render();

			}, this));

		},

		setPagination: function(){

			try {
				var totalQuestions = JSON.parse(window.localStorage.getItem('totalQuestions'));
			} catch (e) {
				// Nothing for now
			}

			// Check if totalQuestions is on localStorage
			if( _.isNull( totalQuestions ) ){

				// Get All answers
				var ref = new Firebase("https://luminous-inferno-7458.firebaseio.com/answers/");

				ref.once("value", _.bind(function(snapshot) {

					// Set values
					this.totals = snapshot.val().length;
					window.localStorage.setItem('totalQuestions',this.totals);

				}));

			}else{

				this.totals = totalQuestions;

			}

		},

		goToPage: function(event){

			var action = $(event.currentTarget).attr('data-action'),
				newID;

			// If prev
			if( action == 'prev' ){
				if( (parseInt(this.actualID) - 1) < 0 ){
					newID = this.totals - 1;
				}else{
					newID = parseInt(this.actualID) - 1;
				}

			// If next
			}else{
				if( (parseInt(this.actualID) + 1) >= this.totals ){
					newID = 0;
				}else{
					newID = parseInt(this.actualID) + 1;
				}
			}

			// goto URL
			window.location.hash = '#/study/'+newID;

		},

		render: function(){

			// Compile template
			var compiledTemplate = _.template( detailTemplate );

			// Render template
			this.$el.html( compiledTemplate( this.model.toJSON() ) );

		},

		prepareListItems: function(){

			// Prepare Info
			if( !_.isUndefined( this.model.get('info') ) && _.isArray( this.model.get('info') ) ){
				this.model.prepareList( this.model.get('info'), 'info' );
			}

			// Prepare Extra
			if( !_.isUndefined( this.model.get('extra') ) && _.isArray( this.model.get('extra') ) ){
				this.model.prepareList( this.model.get('extra'), 'extra' );
			}

			// Prepare Links
			if( !_.isUndefined( this.model.get('links') ) && _.isArray( this.model.get('links') ) ){
				this.model.prepareLinks( this.model.get('links'), 'links' );
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

		},

	});

	return StudyDetailView;

});