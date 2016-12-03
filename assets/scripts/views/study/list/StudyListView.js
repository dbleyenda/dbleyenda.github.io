// Filename: views/study/list/StudyListView
define([
	'jquery',
	'underscore',
	'backbone',
	'collections/study/list/StudyListCollection',
	'text!templates/study/list/studyListTemplate.html',
	'firebase',
	'bootstrap',
], function($, _, Backbone, ListCollection, listTemplate){

	var StudyListView = Backbone.View.extend({

		el: "#id_sectionContainer",

		events: {
			'click .toolbar .btn': 'onToolbarButtonClicked',
			'click .card, tr.questionTR': 'onQuestionDetailClicked'
		},

		initialize: function(options){

			// Toggle footer nav link
			$('#footer-nav .study').hide();
			$('#footer-nav .game').show();

			// Show Loading
			this.mask('#id_loadingMask', 'show');

			// Init List Collection
			this.collection = new ListCollection;

			// Fetch Data
			this.collection.fetch({ 

				// On Success
				success: _.bind(function(collection, response, options){

					// Render
					this.render();

					// Hide Loading
					this.mask('#id_loadingMask', 'hide');

				}, this), 

				// On error
				error: function(){

					console.log('error pidiendo datos');

				}

			});

		},

		render: function(){

			// Compile template
			var compiledTemplate = _.template( listTemplate );

			// Render template
			this.$el.html( compiledTemplate( {
				questions: this.collection.toJSON().reverse()
			} ) );

		},

		onToolbarButtonClicked: function(event){
			
			event.preventDefault()

			// Target
			var button = event.currentTarget;

			// Get option to load
			var optionToLoad = $(button).attr('data-id');

			// Remove Active from toolbar
			this.$el.find('#id_list .toolbar .btn').removeClass('btn-active').addClass('btn-default');

			// Hide toolbar options
			this.$el.find('#id_list .toolbarOption').hide();

			// Set Active button on toolbar
			$(button).removeClass('btn-default').addClass('btn-active');

			// Load List Option
			$(optionToLoad).show();

		},

		onQuestionDetailClicked: function(event){

			event.preventDefault()

			// Target
			var t = event.currentTarget;

			// Get id to load
			var idToLoad = $(t).attr('data-id');

			// Goto detail url
			window.location.hash = '#/study/'+idToLoad;

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

	return StudyListView;

});