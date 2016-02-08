// Filename: views/admin/ArrayView
define([
	'jquery',
	'underscore',
	'backbone',
	'views/admin/ItemView',
	'bootstrap',
	'backbone_validation',
	'backbone_epoxy'
], function($, _, Backbone, ItemView){

	var ArrayView = Backbone.Epoxy.View.extend({

		events: {
			'click .addButton': 'onAddButtonClicked',
		},

		initialize: function(){

			// Bind model validation to view
			Backbone.Validation.bind(this);	

			// Add / remove events
			this.listenTo(this.collection, 'add', this.addItem);
			this.listenTo(this.collection, 'remove', this.removeItem);

			// render
			this.render();
		},

		render: function(){

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
		
		onAddButtonClicked: function(event){

			// prevent default
			event.preventDefault();

			// If Model id valid
			if(this.model.isValid(true)){

				this.collection.add( this.model.toJSON() );

				this.$el.find('.field').val('');

			}
		},

		addItem: function(model){

			if( !_.isUndefined(model.get('info')) ){
				item = model.get('info');
				model.unset('info');
				model.set('item', item);
			}

			if( !_.isUndefined(model.get('links')) ){
				item = model.get('links');
				model.unset('links');
				model.set('item', item);
			}

			if( !_.isUndefined(model.get('extra')) ){
				item = model.get('extra');
				model.unset('extra');
				model.set('item', item);
			}

			// Add new item to DOM
			var itemView = new ItemView({ 
				model: model
			});
			this.$el.find('.itemsAdded').append( itemView.render().el );
		},

	});

	return ArrayView;

});