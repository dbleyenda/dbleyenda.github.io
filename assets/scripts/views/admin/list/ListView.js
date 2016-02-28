// Filename: views/admin/list/ListView
define([
	'jquery',
	'underscore',
	'backbone',
	'collections/admin/list/ListCollection',
	'text!templates/admin/list/listTemplate.html',
	'firebase',
	'bootstrap',
], function($, _, Backbone, ListCollection, listTemplate){

	var ListView = Backbone.View.extend({

		el: "#id_sectionContainer",

		events: {
			'click .toolbar .btn': 'onToolbarButtonClicked',
			'click .remove': 'onRemoveButtonClicked'
		},

		initialize: function(){

			// Show Loading
			this.mask('#id_loadingMask', 'show');

			// Init List Collection
			this.collection = new ListCollection;

			// Fetch Data
			this.collection.fetch({ 

				// On Success
				success: _.bind(function(collection, response, options){

					// // Need to get edit ID					
					// var ref = collection.firebase;
					// ref.once("value", _.bind(function(snapshot) {

					// 	// Get keys as edit ID
					// 	var keys = _.keys( snapshot.val() ),
					// 		collectionWithEditId = this.collection.toJSON();

					// 	// Set KeyID to each model in collection
					// 	_.each(collectionWithEditId, _.bind(function( answer, index ){
					// 		answer['editId'] = keys[index];
					// 	}, this));

					// 	// Reset collection with new attributes
					// 	this.collection.reset( collectionWithEditId, {silent:true} );

						// Render
						this.render();

						// Hide Loading
						this.mask('#id_loadingMask', 'hide');

					//}, this));

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
			this.$el.html( compiledTemplate( {questions: this.collection.toJSON()} ) );

		},

		mask: function(id, action){
			if( action == 'show' ){
				$(id).css('display','table');
			}else if( action == 'hide' ){
				$(id).css('display','none');
			}
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

		onRemoveButtonClicked: function(event){
			
			event.preventDefault();

			var idToRemove = $(event.currentTarget).attr('data-id'),
				question = this.collection.get(idToRemove).toJSON(),
				text = '';

			// Set up confirm text
			text += '¿Desea eliminar la pregunta "';
			text += question['answer'];
			if( 
				!_.isUndefined( question['name'] ) && 
				question['name'] != '' 
			){
				text += ' - ';
				text += question['name'];
			}
			text += '"?';

			// Set up confirm dialog
			var confirmDelete = confirm(text);

			// Ask for confirmation on delete.
			if(confirmDelete){
				// Confirm delete
			}else{
				// Cancel delete. Do nothing.
			}
		},

		close: function(){
			console.log('close List');
			this.destroy();
		},

		destroy: function(){

			// UndelegateEvents
			this.undelegateEvents();

			// TODO checkear como remover la view

		},

	});

	return ListView;

});